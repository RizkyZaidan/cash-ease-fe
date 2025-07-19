"use client"

import React, { useEffect, useState } from "react";
import { Checkbox, Input, Typography } from "@material-tailwind/react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { fetchDataOption, isEmpty } from "@/components/utility";
import ModalComponent from "@/components/layouts/modals/modal-component";
import Autocomplete from "@/components/layouts/form/inputs/autocompletes/autocomplete";
import { Option } from "@/structures/interfaces";
import { OPTION_BANK, toastConfig, TOASTIFY_ERROR, TOASTIFY_SUCCESS } from "@/constants";
import { useToastify } from "@/components/toastify-provider/toastify-provider";
import { addCustomer } from "@/api/customer";

interface ModalAddUserProps {
    isOpen: boolean;
    onClose: () => void
}

const ModalAddUser: React.FC<ModalAddUserProps> = ({
    isOpen,
    onClose
}) => {
    const { showToast } = useToastify();
    const [loading, setLoading] = useState<boolean>(false);
    const [dropdown, setDropdown] = useState<Option[]>([]);
    const [form, setForm] = useState<{
        username: string
        full_name: string
        password: string
        account_no: string
        account_type: string
    }>({
        full_name: "",
        account_no: "",
        account_type: "",
        password: "",
        username: ""
    });
    const handleSaveUser = async () => {
        try {
            const body = {
                full_name: form.full_name,
                username: form.username,
                password: form.password,
                account_type: form.account_type,
                account_no: form.account_no
            }
            const res = await addCustomer(body)

            if (res.status === 200 || res.status === 201) {
                showToast({
                    type: TOASTIFY_SUCCESS,
                    message: "User Berhasil Dibuat!",
                    config: toastConfig,
                });
                setForm({
                    account_type:"",
                    full_name:"",
                    password:"",
                    username:"",
                    account_no: "",
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

    useEffect(() => {
        const getOptionData = async () => {
            const fetchedDataOption = {
                bankOption: await fetchDataOption(OPTION_BANK),
            };
            setDropdown(fetchedDataOption.bankOption)
        };

        if (isEmpty(dropdown)) {
            getOptionData();
        }
    }, []);

    return (
        <>
            <ModalComponent
                title="Tambah User"
                isOpen={isOpen}
                onClose={() => {
                    onClose()
                }}
                loading={loading}
                showCancelButton={true}
                onSave={() => {
                    setLoading(true);
                    handleSaveUser();
                    setLoading(false);
                }}
            >
                <div>
                    <div className="mb-3">
                        <Typography variant="small" className="sm:text-sm lg:text-md mb-1 mt-2 gap-1 text-black text-left">
                            Nama
                        </Typography>
                        <Input
                            placeholder="Masukan Nama Pengguna"
                            className={`sm:h-input-standard-sm md:h-input-standard sm:text-xxxs md:text-sm xl:text-md`}
                            value={form.full_name ?? ""}
                            onChange={
                                (event: React.ChangeEvent<HTMLInputElement>) => {
                                    setForm((prev: any) => ({
                                        ...prev,
                                        full_name: event.target.value
                                    }));
                                }
                            }
                        />
                    </div>
                    <div className="mb-3">
                        <Typography variant="small" className="sm:text-sm lg:text-md mb-1 mt-2 gap-1 text-black text-left">
                            Username
                        </Typography>
                        <Input
                            placeholder="Masukan Nama Username"
                            className={`sm:h-input-standard-sm md:h-input-standard sm:text-xxxs md:text-sm xl:text-md`}
                            value={form.username ?? ""}
                            onChange={
                                (event: React.ChangeEvent<HTMLInputElement>) => {
                                    setForm((prev: any) => ({
                                        ...prev,
                                        username: event.target.value
                                    }));
                                }
                            }
                        />
                    </div>
                    <div className="mb-3">
                        <Typography variant="small" className="sm:text-sm lg:text-md mb-1 mt-2 gap-1 text-black text-left">
                            Password
                        </Typography>
                        <Input
                            placeholder="Masukan Password"
                            className={`sm:h-input-standard-sm md:h-input-standard sm:text-xxxs md:text-sm xl:text-md`}
                            value={form.password ?? ""}
                            onChange={
                                (event: React.ChangeEvent<HTMLInputElement>) => {
                                    setForm((prev: any) => ({
                                        ...prev,
                                        password: event.target.value
                                    }));
                                }
                            }
                        />
                    </div>
                    <div className="mb-3">
                        <Typography variant="small" className="sm:text-sm lg:text-md mb-1 mt-2 gap-1 text-black text-left">
                            Bank Account
                        </Typography>
                        <Autocomplete
                            onChange={(selected: any) => {
                                setForm((prev: any) => ({
                                    ...prev,
                                    account_type: selected.id ?? ""
                                }));
                            }}
                            options={dropdown}
                            placeholder="Pilih Bank"
                            value={{
                                id: form.account_type ?? "",
                            }}
                            isDropdown={true}
                            endAdornment={
                                <Icon
                                    icon="iconoir:nav-arrow-down"
                                    className="text-gray-medium w-5 h-5"
                                />
                            }
                        />
                    </div>
                    <div className="mb-3">
                        <Typography variant="small" className="sm:text-sm lg:text-md mb-1 mt-2 gap-1 text-black text-left">
                            No Rekening
                        </Typography>
                        <Input
                            placeholder="Masukan No Rekening Pengguna"
                            className={`sm:h-input-standard-sm md:h-input-standard sm:text-xxxs md:text-sm xl:text-md`}
                            value={form.account_no ?? ""}
                            onChange={
                                (event: React.ChangeEvent<HTMLInputElement>) => {
                                    setForm((prev: any) => ({
                                        ...prev,
                                        account_no: event.target.value
                                    }));
                                }
                            }
                        />
                    </div>
                </div>
            </ModalComponent>
        </>
    );
};

export default ModalAddUser;
