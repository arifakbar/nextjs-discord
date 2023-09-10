import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import axios from "axios";
import { NextResponse } from "next/server";

export async function PATCH(req,{params}){
        const {serverId} = params;
        try{
                const profile = await currentProfile();
                if(!profile) return NextResponse.json({msg:"Unauthorized", status:401});

                const {name, imageUrl} = await req.json();

                const server = await db.server.update({
                        where:{
                                id:serverId,
                                profileId:profile.id
                        },
                        data:{  
                                name,imageUrl
                        }
                });

                return NextResponse.json({server});

        }catch(err){
                console.log("[SERVER ID PATCH]",err);
                return NextResponse.json({msg:"Internal Error", status:500});
        }
}