function getProductImageUrl(productId) {
  return null;
}
function getWebsiteScreenshotUrl(websiteId) {
  const baseUrl = "/assets";
  return `${baseUrl}/websites/${websiteId}/screenshot.jpg`;
}

export { getWebsiteScreenshotUrl as a, getProductImageUrl as g };
