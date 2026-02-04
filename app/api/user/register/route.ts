    import { connectDB } from "@/db/db";
    import { NextRequest,NextResponse } from "next/server";
    import userModel from "@/model/user";
    import bcrypt from 'bcrypt';
    
    


    export async function POST(request:NextRequest) {
        await connectDB(); //this will connect the mongodb here
        try {
            const body =  await request.json() //frontend se jo dataaya h use extract krta h
            
            const{name,email,password,role,phoneNumber} = body
            if(!name || !email || !password || !role || !phoneNumber )
                {
                    return NextResponse.json(
                        {message:"please fill all the fields details"},
                        {status:400}
                    );
            }
            const isUserExist = await userModel.findOne({email});
            if  (isUserExist){
                return NextResponse.json(
                    {error:"user with this email is already exist"},
                    {status:401}
                );
            }
            const hashPassword = await bcrypt.hash(password,10);
            const newUser = new userModel({
                name,
                email,
                password:hashPassword,
                role,
                phoneNumber,
                profile:{
                   bio:"",
                   skills:[],
                   study:"",
                   experience :[],
                   location:""
                }
            });
            await newUser.save(); //creating a neUser
            return NextResponse.json({newUser},{status:200});

        } catch (error) {
            console.error("Error",error);
            return NextResponse.json(
                {message:"internal server error"},
                {status:500}
            );
        }
    }    
    