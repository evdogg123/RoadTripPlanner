//configuration information 
export const Config={
    serverport: process.env.PORT || 3000,
    secret: process.env.SECRET || "some-secret-goes-here",
    tokenLife: 18000,
    url: process.env.MONGOURL || "mongodb://localhost:27017/"    
};