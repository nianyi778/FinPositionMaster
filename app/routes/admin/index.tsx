import { href, redirect } from "react-router";

export async function loader() {
  return redirect(href("/admin/dashboard"));
}

export default function AdminIndexRoute() {
  return null;
}
