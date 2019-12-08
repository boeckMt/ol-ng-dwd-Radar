export interface IanyObject {
    [s: string]: any;
}

/** https://jvilk.com/MakeTypes/ */
export interface Icapabilities {
    version: string;
    Service: Service;
    Capability: Capability;
}

export interface Service {
    Name: string;
    Title: string;
    Abstract: string;
    KeywordList?: (string)[] | null;
    OnlineResource: string;
    ContactInformation: ContactInformation;
    Fees: string;
    AccessConstraints: string;
}
export interface ContactInformation {
    ContactPersonPrimary: ContactPersonPrimary;
    ContactPosition: string;
    ContactAddress: ContactAddress;
    ContactVoiceTelephone: string;
    ContactFacsimileTelephone: string;
    ContactElectronicMailAddress: string;
}
export interface ContactPersonPrimary {
    ContactPerson: string;
    ContactOrganization: string;
}
export interface ContactAddress {
    AddressType: string;
    Address: string;
    City: string;
    StateOrProvince: string;
    PostCode: string;
    Country: string;
}
export interface Capability {
    Request: Request;
    Exception?: (string)[] | null;
    Layer: Layer;
}
export interface Request {
    GetCapabilities: GetCapabilities;
    GetMap: GetMapOrGetFeatureInfo;
    GetFeatureInfo: GetMapOrGetFeatureInfo;
}
export interface GetCapabilities {
    Format?: (string)[] | null;
    DCPType?: (DCPTypeEntity)[] | null;
}
export interface DCPTypeEntity {
    HTTP: HTTP;
}
export interface HTTP {
    Get: GetOrPost;
    Post: GetOrPost;
}
export interface GetOrPost {
    OnlineResource: string;
}
export interface GetMapOrGetFeatureInfo {
    Format?: (string)[] | null;
    DCPType?: (DCPTypeEntity1)[] | null;
}
export interface DCPTypeEntity1 {
    HTTP: HTTP1;
}
export interface HTTP1 {
    Get: GetOrPost;
}
export interface Layer {
    Title: string;
    Abstract: string;
    CRS?: (string)[] | null;
    EX_GeographicBoundingBox?: (number)[] | null;
    BoundingBox?: (BoundingBoxEntity)[] | null;
    Layer?: (LayerEntity)[] | null;
}
export interface BoundingBoxEntity {
    crs: string;
    extent?: (number)[] | null;
    res?: (null)[] | null;
}
export interface LayerEntity {
    Name: string;
    Title: string;
    Layer?: (LayerEntity1)[] | null;
    queryable: boolean;
    opaque: boolean;
    noSubsets: boolean;
    CRS?: (string)[] | null;
    EX_GeographicBoundingBox?: (number)[] | null;
    BoundingBox?: (BoundingBoxEntity)[] | null;
}
export interface LayerEntity1 {
    Name: string;
    Title: string;
    Layer?: (LayerEntity2)[] | null;
    queryable: boolean;
    opaque: boolean;
    noSubsets: boolean;
    Abstract?: string | null;
    KeywordList?: (string)[] | null;
    CRS?: (string)[] | null;
    BoundingBox?: (BoundingBoxEntity)[] | null;
    Style?: (StyleEntity)[] | null;
}
export interface LayerEntity2 {
    Name: string;
    Title: string;
    Layer?: (LayerEntity3)[] | null;
    queryable: boolean;
    opaque: boolean;
    noSubsets: boolean;
}
export interface LayerEntity3 {
    Name: string;
    Title: string;
    Layer?: (LayerEntity4)[] | null;
    queryable: boolean;
    opaque: boolean;
    noSubsets: boolean;
    Abstract?: string | null;
    KeywordList?: (string)[] | null;
    CRS?: (string)[] | null;
    BoundingBox?: (BoundingBoxEntity)[] | null;
    Style?: (StyleEntity)[] | null;
    Dimension?: (DimensionEntity)[] | null;
    AuthorityURL?: (AuthorityURLEntity)[] | null;
    Identifier?: (string)[] | null;
    MetadataURL?: (MetadataURLEntity)[] | null;
}
export interface LayerEntity4 {
    Name: string;
    Title: string;
    Abstract: string;
    KeywordList?: (string)[] | null;
    CRS?: (string)[] | null;
    BoundingBox?: (BoundingBoxEntity)[] | null;
    Style?: (StyleEntity)[] | null;
    queryable: boolean;
    opaque: boolean;
    noSubsets: boolean;
    Dimension?: (DimensionEntity1)[] | null;
}
export interface StyleEntity {
    Name: string;
    Title: string;
    LegendURL?: (LegendURLEntity)[] | null;
    Abstract?: string | null;
}
export interface LegendURLEntity {
    Format: string;
    OnlineResource: string;
    size?: (number)[] | null;
}
export interface DimensionEntity1 {
    name: string;
    units: string;
    unitSymbol?: null;
    default: string;
    values: string;
}
export interface DimensionEntity {
    name: string;
    units: string;
    unitSymbol?: string | null;
    default: string;
    values: string;
}
export interface AuthorityURLEntity {
    OnlineResource: string;
    name: string;
}
export interface MetadataURLEntity {
    Format: string;
    OnlineResource: string;
    type: string;
}
