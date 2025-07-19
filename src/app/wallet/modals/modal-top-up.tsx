"use client"

import React, { useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import ModalComponent from "@/components/layouts/modals/modal-component";
import { formatNumberToIDR, parseFormattedToRaw } from "@/components/utility";
import { toastConfig, TOASTIFY_ERROR, TOASTIFY_SUCCESS } from "@/constants";
import { useToastify } from "@/components/toastify-provider/toastify-provider";
import { topUpBalance } from "@/api/transaction";

interface ModalTopUpProps {
    id: string
    account_no: string
    isOpen: boolean;
    onClose: () => void
}

const ModalTopUpUser: React.FC<ModalTopUpProps> = ({
    id,
    account_no,
    isOpen,
    onClose
}) => {
    const { showToast } = useToastify();
    const [loading, setLoading] = useState<boolean>(false);
    const [form, setForm] = useState<{
        id: string
        account_no: string
        amount: string
    }>({
        id: id,
        account_no: account_no,
        amount: "",
    });

    const handleTopUp = async () => {
        try {
            const body = {
                id: id,
                account_no: account_no,
                amount: form.amount,
            }
            const res = await topUpBalance(body)

            if (res.status === 200 || res.status === 201) {
                showToast({
                    type: TOASTIFY_SUCCESS,
                    message: "Top Up Berhasil!",
                    config: toastConfig,
                });
                setForm({
                    id: "",
                    account_no: "",
                    amount: ""
                })
                onClose();
            }
        } catch (error) {
            showToast({
                type: TOASTIFY_ERROR,
                message: error as string,
                config: toastConfig,
            });
            onClose();
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = event.target.value;

        // Allow only digits, dots, commas
        if (inputValue === "" || /^[0-9.,]*$/.test(inputValue)) {
            // Parse formatted input to raw number string
            const rawValue = parseFormattedToRaw(inputValue);

            // Update raw value in state
            setForm((prev) => ({
                ...prev,
                amount: rawValue,
            }));
        }
    };

    return (
        <>
            <ModalComponent
                title="Top Up"
                isOpen={isOpen}
                onClose={() => {
                    onClose()
                }}
                loading={loading}
                showCancelButton={true}
                onSave={() => {
                    setLoading(true);
                    handleTopUp();
                    setLoading(false);
                }}
            >
                <div className="mb-12 mt-10">
                    <Typography variant="small" className="sm:text-sm lg:text-md mb-1 mt-2 gap-1 text-black text-left">
                        Nominal
                    </Typography>
                    <Input
                        placeholder="Masukan Nominal Saldo"
                        className={`sm:h-input-standard-sm md:h-input-standard sm:text-xxxs md:text-sm xl:text-md`}
                        value={formatNumberToIDR(form.amount)}
                        onChange={handleChange}
                    />
                </div>
            </ModalComponent>
        </>
    );
};

export default ModalTopUpUser;
