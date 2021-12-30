import { last } from "lodash"

import { Values } from "@components/pages/Main/components/Project"

export const generateAddress = (values: Values) => {
  if (values.type === "url") return values.url
  if (values.type === "phone") return `tel:${values.phone}`
  if (values.type === "wifi")
    return `WIFI:T:${values.wifiType};S:${values.wifiSsid};P:${values.wifiPass};;`
  if (values.type === "email") {
    const params = new URLSearchParams({})
    if (values.emailSubject) params.append("subject", values.emailSubject)
    if (values.emailBody) params.append("subject", values.emailBody)
    return `mailto:${values.emailAddress}?${params.toString()}`
  }

  return values.url
}

export const decodeAddress = (link: string): Values => {
  const res: Values = {
    bgColor: "#fff",
    qrColor: "#000",
    title: "",
    type: "url",
    phone: "",
    url: "",
    emailAddress: "",
    emailSubject: "",
    emailBody: "",
    wifiType: "WPA",
    wifiSsid: "",
    wifiPass: "",
  }

  if (link.startsWith("WIFI:")) {
    res.type = "wifi"
    const [wifiType, wifiSsid, wifiPass] = link.split(";")
    res.wifiType = last(wifiType.split(":"))!
    res.wifiSsid = last(wifiSsid.split(":"))!
    res.wifiPass = last(wifiPass.split(":"))!
  } else if (link.startsWith("tel:")) {
    res.type = "phone"
    res.phone = link.slice(4)
  } else if (link.startsWith("mailto:")) {
    res.type = "email"
    const params = new URLSearchParams(link.split("?")[1])
    if (params.has("subject")) res.emailSubject = params.get("subject")!
    if (params.has("body")) res.emailBody = params.get("body")!
  } else {
    res.type = "url"
    res.url = link
  }

  return res
}
