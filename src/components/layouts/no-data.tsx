import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { isEmpty } from "../utility";

const NoData: React.FC<{
    title: string,
    subTitle: string
}
> = ({ title, subTitle }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full py-10">
            <Typography variant="h5" className="text-gray-dark sm:text-md md:text-lg xl:text-xl mb-2 text-center">
                {isEmpty(title) ? "Tidak Ada Data" : title}

            </Typography>
            <Typography variant="paragraph" className="text-gray-light text-center sm:text-xs md:text-sm xl:text-md">
                {isEmpty(subTitle) ? "Maaf, tidak ada data yang sesuai dengan pencarian Anda. Coba ubah kriteria pencarian." : subTitle}
            </Typography>
        </div>
    );
};
export default NoData;
