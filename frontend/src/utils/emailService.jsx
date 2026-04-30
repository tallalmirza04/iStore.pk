import emailjs from "@emailjs/browser";

const SERVICE_ID  = "service_z75ek8d";
const TEMPLATE_ID = "template_zr6sfg2";
const PUBLIC_KEY  = "4U_7U3PZnw6u0udqe";

export const sendOrderConfirmation = async (order) => {

  // ── Get email ──────────────────────────────────────────
  const toEmail =
    order.email ||
    order.shippingAddress?.email ||
    null;

  if (!toEmail) {
    console.warn("⚠️ No email on order — skipping");
    return;
  }

  const customer    = order.shippingAddress || {};
  const items       = order.orderItems  || [];
  const accessories = order.accessories || [];
  const isPickup    = order.type === "pickup";
  const total       = Number(order.totalPrice || 0);

  // ── Build item list as plain text lines ───────────────
  // Each item on its own line so {{item_list}} renders clearly
  const itemLines = items.map(
    (i) => `• ${i.name} x${i.qty}  —  Rs ${((i.price || 0) * (i.qty || 1)).toLocaleString()}`
  );

  const accLines = accessories
    .filter((a) => a.name)
    .map((a) => `  + ${a.name}  —  ${a.price > 0 ? "Rs " + a.price.toLocaleString() : "Free"}`);

  if (order.warranty && order.warranty !== "none") {
    accLines.push(`  🛡️ Warranty: ${order.warranty}`);
  }

  const itemList = [...itemLines, ...accLines].join("\n");

  // ── Address ───────────────────────────────────────────
  const addressLine = isPickup
    ? "🏪 Store Pickup — iStore.pk, Saddar Market, Rawalpindi"
    : [customer.address, customer.city].filter(Boolean).join(", ");

  // ── Order type label ──────────────────────────────────
  const orderTypeLabel = isPickup ? "🏪 Store Pickup" : "🚚 Delivery Address";

  // ── Template params — must match {{variable}} names in EmailJS template exactly
  const templateParams = {
    to_email:         toEmail,
    order_id:         order.orderId || String(order._id),
    customer_name:    customer.name  || order.name  || "Customer",
    customer_phone:   customer.phone || order.phone || "",
    customer_address: addressLine    || "",
    order_type:       orderTypeLabel,
    item_list:        itemList,
    total:            total.toLocaleString(),
  };

  console.log("📧 Sending email to:", toEmail, "| params:", templateParams);

  try {
    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log("✅ Email sent:", result.status, result.text);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
};