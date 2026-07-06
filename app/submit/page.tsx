import { redirect } from "next/navigation";

// The submit form is retired — firms now list via Gumroad (free or lifetime).
// Anyone hitting /submit is sent to the pricing section.
export default function SubmitRedirect() {
  redirect("/#pricing");
}
