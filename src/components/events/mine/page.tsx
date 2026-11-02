
import { redirect } from "next/navigation";

export default function MyCreatedEventsRedirect() {
  redirect("/events/manage");
}
