/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetchJSONPromise } from '..';

export interface CreatePaymentBody {
  name: string;
  surname: string;
  email: string;
  cpfnumber: string;
  birthdate: string;
  cellphone: string;
  country: string;
  roomtype_id: string;
  start_date: string;
  end_date: string;
  units: number;
  guests: number;
  coupon_code: string;
  custom_price: string | number | null;
  has_cleaning_fee: boolean;
  cardName: string;
  cardNumber: string;
  cardSecurityCode: string;
  cardExpiryDate: string;
  option: string;
  addressCEP: string;
  address: string;
  addressNumber: string;
  addressComplement: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  pre_booking_code: string | null;
  referral: string;
  campaign: string | null;
}

export interface CreatePaymentResponse {
  status: number;
  data: {
    order_id: string;
    qr_code: string;
    qr_code_url: string;
    qr_expiry: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
    payment_status: string;
    external_id: string;
  };
}

export interface SimulatePaymentResponse {
  status: number;
  data: {
    Id: any;
    IsPaid: boolean;
    OrderId: any;
    ExternalId: any;
    Customer: {
      Id: any;
      Email: string;
      FirstName: string;
      LastName: string;
      Document: string;
      BirthDate: {
        date: string;
        timezone_type: number;
        timezone: string;
      };
      PhoneNumber: string;
    };
    Canceled: boolean;
    CanceledAt: any;
    OrderDate: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
    Guests: number;
    RoomType: {
      id: number;
      type: string;
      property: {
        id: number;
        name: string;
        city: string;
        cb_property_id: string;
        mya_property_id: string;
      };
      capacity: number;
      description: string;
    };
    StartDate: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
    EndDate: {
      date: string;
      timezone_type: number;
      timezone: string;
    };
    Units: number;
    TotalPrice: number;
    TotalPriceFloat: string;
    OriginalPrice: number;
    CancellationReason: any;
    OrderStatus: any;
    CreatedAt: any;
    UpdatedAt: any;
    qr_code: any;
    qr_code_url: any;
    qr_expiry: any;
    is_expired: boolean;
    has_cleaning_fee: number;
    coupon: any;
    referral: any;
    campaign: any;
  };
}

interface CheckPaymentResponse {
  status: number;
  code: number;
  message: string;
  entries: number;
  data: SimulatePaymentResponse['data'][];
}

export const simulate = async (
  body: CreatePaymentBody
): FetchJSONPromise<SimulatePaymentResponse> =>
  fetch('https://www.staycharlie.com.br/api/legado/payment/simulate', {
    headers: {
      accept: '*/*',
      'accept-language': 'pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      baggage:
        'sentry-environment=vercel-production,sentry-release=efe0924585db74363ea2cbb3e964960521eaa43b,sentry-public_key=83edee1e5cf345ef9a39eec400d16b93,sentry-trace_id=683dec99207b429481146fedafaa2907',
      'cache-control': 'no-cache',
      'content-type': 'text/plain;charset=UTF-8',
      pragma: 'no-cache',
      'sec-ch-ua':
        '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sentry-trace': '683dec99207b429481146fedafaa2907-9d7e7593b8af21b1-1',
      cookie:
        '__Host-next-auth.csrf-token=3267f3f3b51d8e35e1ce3e0dbccd0076685796d3e2b700087c0be34d5db7cf33%7C995af7d4a3d1294475118f4c512881fa7c7519746d1edc9fda52dc6d7af1dfa5; rdtrk=%7B%22id%22%3A%22dc41aef9-c13a-4022-8e3a-d276d1873260%22%7D; _gac_UA-233283249-1=1.1709919602.CjwKCAiAi6uvBhADEiwAWiyRdnmM9p6dJCb3OowOTA-C9UVIDMdHCYBQL6DzDy_FK42JwJcRZvyWFxoC7n4QAvD_BwE; _gcl_aw=GCL.1709919602.CjwKCAiAi6uvBhADEiwAWiyRdnmM9p6dJCb3OowOTA-C9UVIDMdHCYBQL6DzDy_FK42JwJcRZvyWFxoC7n4QAvD_BwE; _gcl_au=1.1.1466925686.1708546998.1658612354.1709920241.1709920241; _ga_B0ZQ0GE6JR=GS1.1.1709919601.3.1.1709920648.0.0.0; _hjSessionUser_2878583=eyJpZCI6ImJjMzliYTFjLTBmOGItNTc3OC05YzllLWJmNGFkMDdhZjk0MiIsImNyZWF0ZWQiOjE3MDk5MjA0MTY1NDIsImV4aXN0aW5nIjp0cnVlfQ==; _fbp=fb.2.1710539783311.901132916; _ga=GA1.1.1680541578.1708546998; __trf.src=encoded_eyJmaXJzdF9zZXNzaW9uIjp7InZhbHVlIjoiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8iLCJleHRyYV9wYXJhbXMiOnt9fSwiY3VycmVudF9zZXNzaW9uIjp7InZhbHVlIjoiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8iLCJleHRyYV9wYXJhbXMiOnt9fSwiY3JlYXRlZF9hdCI6MTcxMTY0MjA1NDA5NH0=; _ga_936SSLPMBE=GS1.1.1711909257.6.1.1711909494.60.0.0; _hjSessionUser_3930634=eyJpZCI6IjhiOWU4N2ExLTAwYmQtNWQ5YS1iN2E4LWMxNmEzZmRmMWZkNiIsImNyZWF0ZWQiOjE3MTIyNTU4MzM4MTIsImV4aXN0aW5nIjp0cnVlfQ==; __Secure-next-auth.callback-url=https%3A%2F%2Fwww.staycharlie.com.br%2Flogin; _ga_2ZTWP73183=GS1.1.1712263378.24.1.1712266780.34.0.0',
      Referer:
        'https://www.staycharlie.com.br/pagamento/processador?paymentType=pix',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: JSON.stringify(body),
    method: 'POST',
  });

export const create = async (
  body: CreatePaymentBody
): FetchJSONPromise<CreatePaymentResponse> =>
  fetch('https://www.staycharlie.com.br/api/legado/payment/create', {
    headers: {
      accept: '*/*',
      'accept-language': 'pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      baggage:
        'sentry-environment=vercel-production,sentry-release=94768454e3e0cbd5696fe48bc25d962161c30bef,sentry-public_key=83edee1e5cf345ef9a39eec400d16b93,sentry-trace_id=c849d4414d6a4995ba8c9889e2d635cc',
      'cache-control': 'no-cache',
      'content-type': 'text/plain;charset=UTF-8',
      pragma: 'no-cache',
      'sec-ch-ua':
        '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sentry-trace': 'c849d4414d6a4995ba8c9889e2d635cc-8db35c3fc2ab9c66-1',
      cookie:
        '__Host-next-auth.csrf-token=3267f3f3b51d8e35e1ce3e0dbccd0076685796d3e2b700087c0be34d5db7cf33%7C995af7d4a3d1294475118f4c512881fa7c7519746d1edc9fda52dc6d7af1dfa5; rdtrk=%7B%22id%22%3A%22dc41aef9-c13a-4022-8e3a-d276d1873260%22%7D; _gac_UA-233283249-1=1.1709919602.CjwKCAiAi6uvBhADEiwAWiyRdnmM9p6dJCb3OowOTA-C9UVIDMdHCYBQL6DzDy_FK42JwJcRZvyWFxoC7n4QAvD_BwE; _gcl_aw=GCL.1709919602.CjwKCAiAi6uvBhADEiwAWiyRdnmM9p6dJCb3OowOTA-C9UVIDMdHCYBQL6DzDy_FK42JwJcRZvyWFxoC7n4QAvD_BwE; _gcl_au=1.1.1466925686.1708546998.1658612354.1709920241.1709920241; _ga_B0ZQ0GE6JR=GS1.1.1709919601.3.1.1709920648.0.0.0; _hjSessionUser_2878583=eyJpZCI6ImJjMzliYTFjLTBmOGItNTc3OC05YzllLWJmNGFkMDdhZjk0MiIsImNyZWF0ZWQiOjE3MDk5MjA0MTY1NDIsImV4aXN0aW5nIjp0cnVlfQ==; _fbp=fb.2.1710539783311.901132916; _ga=GA1.1.1680541578.1708546998; __trf.src=encoded_eyJmaXJzdF9zZXNzaW9uIjp7InZhbHVlIjoiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8iLCJleHRyYV9wYXJhbXMiOnt9fSwiY3VycmVudF9zZXNzaW9uIjp7InZhbHVlIjoiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8iLCJleHRyYV9wYXJhbXMiOnt9fSwiY3JlYXRlZF9hdCI6MTcxMTY0MjA1NDA5NH0=; _ga_936SSLPMBE=GS1.1.1711909257.6.1.1711909494.60.0.0; _hjSessionUser_3930634=eyJpZCI6IjhiOWU4N2ExLTAwYmQtNWQ5YS1iN2E4LWMxNmEzZmRmMWZkNiIsImNyZWF0ZWQiOjE3MTIyNTU4MzM4MTIsImV4aXN0aW5nIjp0cnVlfQ==; __Secure-next-auth.callback-url=https%3A%2F%2Fwww.staycharlie.com.br%2Flogin; _hjSession_3930634=eyJpZCI6ImFmNGQ4ZWMxLTYxMjQtNDA3Ni1hYzRhLTVkMmU2MzM0MTk1ZCIsImMiOjE3MTIyNjMzNzg5NTgsInMiOjEsInIiOjEsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; _ga_2ZTWP73183=GS1.1.1712263378.24.1.1712266756.58.0.0',
      Referer:
        'https://www.staycharlie.com.br/pagamento/processador?paymentType=pix',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: JSON.stringify(body),
    method: 'POST',
  });

export const check = (id: string): FetchJSONPromise<CheckPaymentResponse> =>
  fetch(`https://www.staycharlie.com.br/api/legado/check?id=${id}`, {
    headers: {
      accept: '*/*',
      'accept-language': 'pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      baggage:
        'sentry-environment=vercel-production,sentry-release=94768454e3e0cbd5696fe48bc25d962161c30bef,sentry-public_key=83edee1e5cf345ef9a39eec400d16b93,sentry-trace_id=c849d4414d6a4995ba8c9889e2d635cc',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-ch-ua':
        '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sentry-trace': 'c849d4414d6a4995ba8c9889e2d635cc-8db35c3fc2ab9c66-1',
      cookie:
        '__Host-next-auth.csrf-token=3267f3f3b51d8e35e1ce3e0dbccd0076685796d3e2b700087c0be34d5db7cf33%7C995af7d4a3d1294475118f4c512881fa7c7519746d1edc9fda52dc6d7af1dfa5; rdtrk=%7B%22id%22%3A%22dc41aef9-c13a-4022-8e3a-d276d1873260%22%7D; _gac_UA-233283249-1=1.1709919602.CjwKCAiAi6uvBhADEiwAWiyRdnmM9p6dJCb3OowOTA-C9UVIDMdHCYBQL6DzDy_FK42JwJcRZvyWFxoC7n4QAvD_BwE; _gcl_aw=GCL.1709919602.CjwKCAiAi6uvBhADEiwAWiyRdnmM9p6dJCb3OowOTA-C9UVIDMdHCYBQL6DzDy_FK42JwJcRZvyWFxoC7n4QAvD_BwE; _gcl_au=1.1.1466925686.1708546998.1658612354.1709920241.1709920241; _ga_B0ZQ0GE6JR=GS1.1.1709919601.3.1.1709920648.0.0.0; _hjSessionUser_2878583=eyJpZCI6ImJjMzliYTFjLTBmOGItNTc3OC05YzllLWJmNGFkMDdhZjk0MiIsImNyZWF0ZWQiOjE3MDk5MjA0MTY1NDIsImV4aXN0aW5nIjp0cnVlfQ==; _fbp=fb.2.1710539783311.901132916; _ga=GA1.1.1680541578.1708546998; __trf.src=encoded_eyJmaXJzdF9zZXNzaW9uIjp7InZhbHVlIjoiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8iLCJleHRyYV9wYXJhbXMiOnt9fSwiY3VycmVudF9zZXNzaW9uIjp7InZhbHVlIjoiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8iLCJleHRyYV9wYXJhbXMiOnt9fSwiY3JlYXRlZF9hdCI6MTcxMTY0MjA1NDA5NH0=; _ga_936SSLPMBE=GS1.1.1711909257.6.1.1711909494.60.0.0; _hjSessionUser_3930634=eyJpZCI6IjhiOWU4N2ExLTAwYmQtNWQ5YS1iN2E4LWMxNmEzZmRmMWZkNiIsImNyZWF0ZWQiOjE3MTIyNTU4MzM4MTIsImV4aXN0aW5nIjp0cnVlfQ==; __Secure-next-auth.callback-url=https%3A%2F%2Fwww.staycharlie.com.br%2Flogin; _ga_2ZTWP73183=GS1.1.1712263378.24.1.1712269499.58.0.0',
      Referer: `https://www.staycharlie.com.br/tr/${id}`,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: null,
    method: 'GET',
  });
