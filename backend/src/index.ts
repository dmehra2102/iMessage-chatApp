import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createServer } from "http";
import express from "express";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import { makeExecutableSchema } from "@graphql-tools/schema";

async function main(){
    const app = express();
    const httpServer = createServer(app);

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
      });

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        cache : "bounded",
        plugins : [
            ApolloServerPluginDrainHttpServer({ httpServer }),
        ]
    });
    
    await server.start();
    // server.applyMiddleware({app});
    await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`Server is now running on http://localhost:4000/graphql`);
}

main().catch((error)=> console.log(error));