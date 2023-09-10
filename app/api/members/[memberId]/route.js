import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req,{params}){
        try{
                const {role} = await req.json();
                const {searchParams} = new URL(req.url);

                const profile = await currentUser();
                if(!profile) return NextResponse.json({msg:"Unauthorized", status:401});

                const serverId = searchParams.get("serverId");
                if(!serverId ) return NextResponse.json({msg:"Server Id Missing", status:400});

                if(!params.memberId) return NextResponse.json({msg:"Member Id Missing", status:400});

                const server = await db.server.update({
                        where:{
                                id:serverId,
                                profileId : profile.id
                        },
                        data:{
                                members:{
                                        update:{
                                                where:{
                                                        id:params.memberId,
                                                        profileId : {
                                                                not:profile.id
                                                        }
                                                },
                                                data : {
                                                        role
                                                }
                                        }
                                }
                        },
                        include:{
                                members:{
                                        include:{
                                                profile:true
                                        },
                                        orderBy:{
                                                role:"asc"
                                        }
                                }
                        }
                });

                return NextResponse.json({msg:"Success", server})
        }catch(err){
                console.log(err);
                return NextResponse.json({msg:"[MEMBER ID PATCH]: internal error", status:500})
        }
}