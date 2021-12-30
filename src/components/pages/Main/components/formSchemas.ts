import * as yup from "yup"

export const urlSchema = yup.object().shape({
  name: yup.string().min(2).required("Project name is required"),
  url: yup.string().url().required(),
})

export const emailSchema = yup.object().shape({
  name: yup.string().min(2).required("Project name is required"),
  email: yup.string().email().required(),
  subject: yup.string(),
  body: yup.string(),
})

export const wifiSchema = yup.object().shape({
  name: yup.string().min(2).required("Project name is required"),
  ssid: yup.string().required(),
  password: yup.string().required(),
  type: yup.string().required(),
})

export const phoneSchema = yup.object().shape({
  name: yup.string().min(2).required("Project name is required"),
  phone: yup.string().required(),
})
