import { getToken } from "../../utils/token";

export default function () {
  return {
    token: getToken(),
    nickname: ''
  }
}
