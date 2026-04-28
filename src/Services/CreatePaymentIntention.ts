var myHeaders = new Headers();
myHeaders.append("Authorization", `Token ${process.env.PAYMOB_SECRET}`);
myHeaders.append("Content-Type", "application/json");
myHeaders.append(
  "api_key",
  "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRFMU5Ea3lOeXdpYm1GdFpTSTZJbWx1YVhScFlXd2lmUS5Bc1dINzFWcnRQLUtBSWU2LVFadVhhY2pzaU1DYXZQT0R2cUhmTGJRZW02SnRSSkN5WEVUcFRFYnBLWmVRdmNMUFdTQ0xqcmFsWWFKZjB4WnJvV3dSdw==",
);

var raw = JSON.stringify({
  amount: 2000,
  currency: "EGP",
  payment_methods: [5624415],
  items: [
    {
      name: "Monthly Payment",
      amount: 2000,
      description: "get a monthly description in lawsync",
      quantity: 1,
    },
  ],
  billing_data: {
    apartment: "dumy",
    first_name: "ala",
    last_name: "zain",
    street: "dumy",
    building: "dumy",
    phone_number: "+2010xxxxxxxx",
    city: "dumy",
    country: "dumy",
    email: "ali@gmail.com",
    floor: "dumy",
    state: "dumy",
  },
  extras: {
    ee: 22,
  },
  special_reference: `order_${Date.now()}`,
  expiration: 3600,
  notification_url: "https://webhook.site/api/webhook",
  redirection_url: "https://www.google.com/",
});

export default async function CreateIntention() {
  const res = await fetch("https://accept.paymob.com/v1/intention/", {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  });

  const data = await res.json();
  return data;
}
