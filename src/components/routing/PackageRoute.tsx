import type { ReactNode } from "react";
import { hasPackageFeature, type PackageFeatureKey } from "@/config/packageConfig";
import FeatureUnavailable from "@/pages/FeatureUnavailable";

interface PackageRouteProps {
  feature: PackageFeatureKey;
  children: ReactNode;
}

export function PackageRoute({ feature, children }: PackageRouteProps) {
  if (!hasPackageFeature(feature)) {
    return <FeatureUnavailable />;
  }

  return <>{children}</>;
}
