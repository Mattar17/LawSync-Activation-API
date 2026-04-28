var myHeaders = new Headers();
myHeaders.append("Authorization", `Token ${process.env.PAYMOB_SECRET}`);
myHeaders.append("Content-Type", "application/json");
myHeaders.append("api_key", process.env.PAYMOB_API_KEY!);

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
  notification_url:
    "https://law-sync-activation-api.vercel.app/api/payment/webhook",
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
