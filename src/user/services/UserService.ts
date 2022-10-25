import { User } from "../../auth/User";
import { getBucketUrl } from "../../api/BucketStorageService";
import { useRouter } from "vue-router";
export async function getUser() {

}

export function getUserProfileImage(user?: User | null | undefined) {
  if (user && user.profile && user.profile.avatar)
    return getBucketUrl(user.profile, user.profile.avatar)

  const router = useRouter();
  router.replace("/auth/log-in")
  return ""
}
