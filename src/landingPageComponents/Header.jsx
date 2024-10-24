import { Button, Typography } from "@mui/material";



const Header = () => {
    return(
        <div className="w-full flex items-end justify-between p-4 h-16">
        <div>
            <p className="font-ks text-3xl">
            Ancript
            </p>
        </div>

        <div className="flex-grow flex justify-center gap-5">
            <p className="font-karma font-medium">
            Features
            </p>
            <p className="font-karma font-medium">
            Examples
            </p>
            <p className="font-karma font-medium">
            Pricing
            </p>
        </div>

        <div className="rounded-lg bg-black text-center items-center px-3 py-2">
            <p className="font-karma text-white text-sm">Go To App</p>
        </div>
        </div>
    )
}

export default Header;