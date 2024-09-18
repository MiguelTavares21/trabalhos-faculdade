module namespace page = 'http://basex.org/examples/web-page';
declare namespace salesModule = 'http://example.com/sales-module';

declare
 %rest:path("/getSales")
 %rest:query-param("ano", "{$ano}")
 %rest:query-param("mes", "{$mes}")
 %rest:GET
function page:getSales($ano as xs:integer, $mes as xs:integer) {
  let $xml := page:getSalesRawData($ano, $mes)
  let $parsedXml := page:transformSalesXML($xml)
  return $parsedXml
};

declare function page:getSalesRawData($ano as xs:integer, $mes as xs:integer) {
  let $rightMes := fn:format-number($mes, "00") (: com isto não vai ignorar o 0 caso o mes seja 03 :)
  
   let $rightProximoMes :=
    if ($mes eq 12) (: se mes for iguala 12 volta a um:)
    then fn:format-number(1, "00")
    else fn:format-number($mes + 1, "00")
  
  let $nextYear := (: se mes igual a 12 incrementa o ano 1:)
    if ($mes eq 12)
    then $ano + 1
    else $ano  

  let $url := "https://eu-central-1.aws.data.mongodb-api.com/app/data-ewiqb/endpoint/data/v1"
  let $findSuffix := "/action/find"
  let $apiKey := "i0Opp9ehgn2DAQOciGftWzQShtx7YC5FKnX0qqfsvNWAbKbRpErxaxw0LKE2xuSt"
  let $contentType := "application/json"
  let $body := concat('{
      "collection":"salesSampleCollection",
      "database":"Projeto",
      "dataSource":"ProjetoPei",

        "filter": {
            "date": {
                "$gte": {"$date": "', $ano, '-', $rightMes, '-01T00:00:00Z"},
                "$lt": {"$date": "', $nextYear, '-', $rightProximoMes, '-01T00:00:00Z"}
            }
        },
        "projection": {
       "_id": 0,
       "invoice_id": 1,
       "date": 1,
       "customer_id": 1,
       "sales_lines": 1,
       "total_sales": 1,
       "productsSold": 1,
       "customer": 1,
       "products": 1
   }
}')


  let $httpResponse := http:send-request(
    <http:request method='post'>
      {<http:header name="Access-Control-Request-Headers" value="*"/>},
      {<http:header name="api-key" value='{$apiKey}'/>}
      
      {<http:body media-type='{$contentType}'>{$body}</http:body>}
    </http:request>,
    concat($url, $findSuffix)
  )
  
  return $httpResponse[2]
};

declare function page:getDistinctSalesCount($xml) {
  let $distinctInvoiceIds :=
    for $sale in $xml/json/documents/*
    return distinct-values($sale/invoice__id)

  let $count := count($distinctInvoiceIds)
  return $count
};

declare function page:getTotalSalesValue($xml) {
   let $totalSale :=
    for $sale in $xml/json/documents/*
    return ($sale/total__sales)

  let $totalSales := sum($totalSale)
  return $totalSales
};


declare function page:getDistinctProductCount($xml) {
  let $distinctProductIds :=
    for $sale in $xml/json/documents/*
    return distinct-values($sale/productsSold)

  let $count := sum($distinctProductIds)
  return $count
};

declare function page:getDistinctCustomerCount($xml) {
  let $distinctCustomerIds :=
    for $sale in $xml/json/documents/*
    return distinct-values($sale/customer//id)

  let $count := count($distinctCustomerIds)
  return $count
};


declare function page:transformSalesXML($xml) {
  let $resultXml := 
 <SalesReport>
 
 <NIF>675033859</NIF>
 <Nome>Helder Tavares</Nome>
 <Morada>Vizela, Braga</Morada>
 <Ano_Fiscal>2022</Ano_Fiscal>
 <Mes>08</Mes>
 
 <number_of_distinct_products>{page:getDistinctProductCount($xml)}</number_of_distinct_products>

 <number_of_sales> {page:getDistinctSalesCount($xml)} </number_of_sales>
 
 <total_sales_value> {page:getTotalSalesValue($xml)} </total_sales_value>
 
 <number_of_distinct_customers>{page:getDistinctCustomerCount($xml)}</number_of_distinct_customers>
 
    <salesInfo>
    {
      for $sale in $xml/json/documents/*
      return (
     <sale>
     <number_distinct_products>{$sale/productsSold/text()}</number_distinct_products>
      <sale_id>{$sale/invoice__id/text()}</sale_id>
      <sale_date>{$sale/date/text()}</sale_date>
      <total_sale_spent>{$sale/total__sales/text()}</total_sale_spent>
      <customerInfo>
        <first_Name>{$sale/customer//first__name/text()}</first_Name>
        <last_Name>{$sale/customer//last__name/text()}</last_Name>
        <customer_email>{$sale/customer//email/text()}</customer_email>
        <address>
          <postal_Code>{$sale/customer//postal__code/text()}</postal_Code>
          <city>{$sale/customer//city/text()}</city>
          <country>{$sale/customer//country/text()}</country>
        </address>
        <customer_Type> {$sale/customer//clientType/text()} </customer_Type>
        <customer_Purchases> {$sale/customer//num__compras/text()} </customer_Purchases>
      </customerInfo>
      
<productsInfo>{
  for $product in $sale//products
  return
    <product>
      <product_code>{$product//id/text()}</product_code>
      <list_price>{$product//list__price/text()}</list_price>
      <brand>{$product//brand/text()}</brand>
      <model>{$product//model/text()}</model>
      <subcategories>{
        for $subcategory in $product//categories
        return
          <subcategory>
            <name>{$subcategory//sub__category/text()}</name>
            <category_name>{$subcategory//category/text()}</category_name>
          </subcategory>
      }</subcategories>
    </product>
}</productsInfo>
    
    <sale_lines>
      {
        for $line in $sale/sales__lines
        return
          <sale_line>
            <number>{$line//invoice__id/text()}</number>
            <product_code>{$line//product__id/text()}</product_code>
            <total_with_vat>{$line//total__with__vat/text()}</total_with_vat>
            <quantity>{$line//quantity/text()}</quantity>
          </sale_line>
      }
    </sale_lines>
  </sale>
)
    }
   </salesInfo>
   </SalesReport>
    (: let $validatexml := validate:xsd($resultXml, "salesSchema.xsd") :) 
   return $resultXml
};




