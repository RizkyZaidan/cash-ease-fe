"use client"

import React, { useEffect, useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import ModalComponent from "@/components/layouts/modals/modal-component";
import { fetchUserAsOption, formatNumberToIDR, isEmpty, parseFormattedToRaw } from "@/components/utility";
import { toastConfig, TOASTIFY_ERROR, TOASTIFY_SUCCESS } from "@/constants";
import { useToastify } from "@/components/toastify-provider/toastify-provider";
import { topUpBalance, transferBalance } from "@/api/transaction";
import { Option } from "@/structures/interfaces";
import Autocomplete from "@/components/layouts/form/inputs/autocompletes/autocomplete";
import { Icon } from "@iconify/react/dist/iconify.js";

interface ModalTransferProps {
    id: string
    account_no: string
    isOpen: boolean;
    onClose: () => void
}

const ModalTransferUser: React.FC<ModalTransferProps> = ({
    id,
    account_no,
    isOpen,
    onClose
}) => {
    const { showToast } = useToastify();
    const [loading, setLoading] = useState<boolean>(false);
    const [dropdown, setDropdown] = useState<Option[]>([]);
    const [form, setForm] = useState<{
        id: string
        account_no: string
        destination_id: string
        destination_account_no: string
        amount: string
    }>({
        id: id,
        account_no: account_no,
        amount: "",
        destination_account_no: "",
        destination_id: ""
    });

    const handleTransfer = async () => {
        try {
            const body = {
                user_id_source: id,
                user_account_no_source: account_no,
                user_id_destination: form.destination_id,
                user_account_no_destination: form.destination_account_no,
                amount: form.amount,
            }
            const res = await transferBalance(body)

            if (res.status === 200 || res.status === 201) {
                showToast({
                    type: TOASTIFY_SUCCESS,
                    message: "Transfer Berhasil!",
                    config: toastConfig,
                });
                setForm({
                    id: "",
                    account_no: "",
                    amount: "",
                    destination_account_no: "",
                    destination_id: ""
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

            setForm((prev) => ({
                ...prev,
                amount: rawValue,
            }));
        }
    };

    useEffect(() => {
        const getOptionData = async () => {
            const fetchedDataOption = {
                userOption: await fetchUserAsOption(),
            };
            setDropdown(fetchedDataOption.userOption)
        };

        if (isEmpty(dropdown)) {
            getOptionData();
        }
    }, []);

    return (
        <>
            <ModalComponent
                title="Transfer Ke"
                isOpen={isOpen}
                onClose={() => {
                    onClose()
                }}
                loading={loading}
                showCancelButton={true}
                onSave={() => {
                    setLoading(true);
                    handleTransfer();
                    setLoading(false);
                }}
            >
                <div className="mb-12 mt-10">
                    <div className="mb-3">
                        <Typography variant="small" className="sm:text-sm lg:text-md mb-1 mt-2 gap-1 text-black text-left">
                            Nama Penerima
                        </Typography>
                        <Autocomplete
                            onChange={(selected: any) => {
                                setForm((prev: any) => ({
                                    ...prev,
                                    destination_id: selected.id ?? "",
                                    destination_account_no: selected.name ?? ""
                                }));
                            }}
                            options={dropdown}
                            placeholder="Pilih Penerima"
                            value={{
                                id: form.destination_id ?? "",
                            }}
                            endAdornment={
                                <Icon
                                    icon="iconoir:nav-arrow-down"
                                    className="text-gray-medium w-5 h-5"
                                />
                            }
                        />
                    </div>
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

export default ModalTransferUser;
