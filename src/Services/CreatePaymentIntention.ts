var myHeaders = new Headers();
myHeaders.append("Authorization", `Token ${process.env.PAYMOB_SECRET}`);
myHeaders.append("Content-Type", "application/json");
myHeaders.append("api_key", process.env.PAYMOB_API_KEY!);

var raw = {
  amount: 150,
  currency: "EGP",
  payment_methods: [5624415],
  items: [
    {
      name: "Monthly Payment",
      amount: 150,
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
  redirection_url: "https://lawsync-saas.vercel.app/payment_webhook",
};

export default async function CreateIntention(userId: string) {
  let hashedUserID = "";
  const slicedUserId = userId.split("-")[0];
  for (let i = 0; i < slicedUserId!.length; i++) {
    const random = Math.floor(Math.random() * 32);
    hashedUserID += slicedUserId!.charCodeAt(i) + random;
  }
  const newSpecialReference = `order_${hashedUserID}`;
  const res = await fetch("https://accept.paymob.com/v1/intention/", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      ...raw,
      special_reference: newSpecialReference,
      user_id: userId,
    }),
    redirect: "follow",
  });

  const data = await res.json();
  return data;
}
