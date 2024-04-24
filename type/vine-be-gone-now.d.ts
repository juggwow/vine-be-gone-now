export type Karnfaifa = {
  businessName: string;
  fullName: string;
  aoj: string;
};
export type Geolocation = {
  lat: string;
  lon: string;
  karnfaifa: Karnfaifa | null;
};

export type ResponeUploadImageSuccess = {
  url: string;
  id: string;
};

export type ResponeUploadImageFail = {
  error: string;
};

export type RequestData = Geolocation & {
  riskPoint: string;
  place: string;
  uploadedImage: ResponeUploadImageSuccess;
};
