import { utils } from "ethers";
import omitDeep from "omit-deep";

// 1. Sign typed data with omitted __typename values using omit-deep
export function omitTypename(object) {
  return omitDeep(object, ["__typename"]);
}

export async function signTypedDataWithOmmittedTypename(
  sdk,domain,types,value) {
  // Perform the signing using the SDK
  return await sdk.wallet.signTypedData(
    omitTypename(domain, '__typename'),
    omitTypename(types, '__typename'),
    omitTypename(value, '__typename')
  );
}
export const splitSignature = (signature) => {
    return utils.splitSignature(signature);
  };