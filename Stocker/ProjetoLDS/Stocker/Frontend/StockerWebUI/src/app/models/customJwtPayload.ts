import { JwtPayload } from 'jwt-decode';

export interface customJwtPayload extends JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
}
