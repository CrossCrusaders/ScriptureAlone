import { User } from "../../auth/User";
import { getBucketUrl } from "../../core/services/BucketStorageService";

export async function getUser() {

}

export function getUserProfileImage(user?: User | null | undefined) {
  if (user && user.profile && user.profile.avatar)
    return getBucketUrl(user.profile, user.profile.avatar)

  return "https://loremflickr.com/320/240?lock=1"
}