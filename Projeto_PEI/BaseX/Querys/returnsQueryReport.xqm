module namespace page = 'http://basex.org/examples/web-page';
declare namespace salesModule = 'http://example.com/sales-module';


declare
 %rest:path("/getReturns")
 %rest:query-param("ano", "{$ano}")
 %rest:query-param("mes", "{$mes}")
 %rest:GET
function page:getReturns($ano as xs:integer, $mes as xs:integer) {
  let $xml := page:getReturnsRawData($ano, $mes)
  let $parsedXml := page:returnsToXML($xml)
  return $parsedXml
};

declare function page:getReturnsRawData($ano as xs:integer, $mes as xs:integer) {
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
      "collection":"returns",
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
       "product_id": 1,
       "date": 1,
       "returnedProducts": 1,
       "sales_data": 1,
       "early_return": 1,
       "days_to_return": 1
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


declare function page:getDistinctProductCount($xml) {
  let $distinctProductIds :=
    for $return in $xml/json/documents/*
    return distinct-values($return/returnedProducts//id)

  let $count := count($distinctProductIds)
  return $count
};



declare function page:returnsToXML($xml) {
    let $resultXml := 
 <ReturnsReport>
 <NIF>675033859</NIF>
 <Nome>Helder Tavares</Nome>
 <Morada>Vizela, Braga</Morada>
 <Ano_Fiscal>2022</Ano_Fiscal>
 <Mes>05</Mes>
 <number_distinct_products>{page:getDistinctProductCount($xml)}</number_distinct_products>
    <returns>
    {
      for $return in $xml/json/documents/*
      return (
     <documentReturn> 
      <invoice_id>{$return/invoice__id/text()}</invoice_id>
      <return_date>{$return/date/text()}</return_date>
      <daysToReturn>{$return/days__to__return/text()}</daysToReturn>
      <earlyReturn>{$return/early__return/text()}</earlyReturn>
    
    <products>
      {
        for $product in $return/returnedProducts
        return
          <product>
            <product_code>{$product//id/text()}</product_code>
            <list_price>{$product//list__price/text()}</list_price>
            <brand>{$product//brand/text()}</brand>
            <model>{$product//model/text()}</model>
          </product>
      }
    </products>
    
    <associatedSales>
      {
          <sale>
            <date>{$return//sales__data//date/text()}</date>
            <customer_id>{$return//sales__data//customer__id/text()}</customer_id>
          </sale>
      }
    </associatedSales>
  </documentReturn>
      )  
    }
   </returns>
   </ReturnsReport>
   let $validatexml := validate:xsd($resultXml, "returnsSchema.xsd")
   return $resultXml 
};