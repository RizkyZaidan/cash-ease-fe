"use client";

import { fetchCustomerList } from "@/api/customer";
import { fetchDashboard } from "@/api/dashboard";
import TextInput from "@/components/layouts/form/inputs/text-input";
import PaginationComponent from "@/components/layouts/form/paginations/pagination";
import { fetchDataOption, formatDecimalString, isEmpty, mapPaginationData, mapUserData, objectToQueryStringNullable } from "@/components/utility";
import { OPTION_BANK } from "@/constants";
import { Option, Pagination, User } from "@/structures/interfaces";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar, Button, Card, Menu, Tooltip, Typography } from "@material-tailwind/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import ModalAddUser from "./modals/modal-add-user";
import ModalTopUpUser from "./modals/modal-top-up";
import ModalTransferUser from "./modals/modal-transfer";


const TABLE_HEAD = [
    "Nama",
    "Bank",
    "Saldo",
    "Aksi",
];

export default function Wallet() {
    const [data, setData] = useState<{
        stats: {
            totalBalance: string,
            totalUser: string
        },
        search: string,
        total: number,
        lastPage: number,
        limit: number,
        page: number,
        bankOption: Option[],
        dataWallet: User[],
        loading: boolean
    }>({
        stats: {
            totalBalance: "0",
            totalUser: "0"
        },
        search: "",
        limit: 5,
        page: 1,
        total: 0,
        lastPage: 1,
        dataWallet: [],
        bankOption: [],
        loading: true
    });

    const [createUserModal, setCreateUserModal] = useState<boolean>(false);
    const [userModal, setUserModal] = useState<{
        isTransferOpen: boolean
        isTopUpOpen: boolean
        id: string,
        account_no: string
    }>({
        isTopUpOpen: false,
        isTransferOpen: false,
        id: "",
        account_no: ""
    });


    const handleSearch = async () => {
        fetchDataUser();
    };

    const handleOpenUserModal = () => {
        setCreateUserModal(true)
    }

    const handleCloseUserModal = () => {
        setCreateUserModal(false)
        fetchStats();
        fetchDataUser();
    }

    const handleCloseTopUpModal = () => {
        setUserModal((prev) => ({
            ...prev,
            id: "",
            account_no: "",
            isTopUpOpen: false
        }))
        fetchStats();
        fetchDataUser();
    }
    const handleCloseTransferModal = () => {
        setUserModal((prev) => ({
            ...prev,
            id: "",
            account_no: "",
            isTransferOpen: false
        }))
        fetchStats();
        fetchDataUser();
    }

    const handlePageChange = (page: number) => {
        setData((prev) => ({
            ...prev,
            page: page,
            loading: true
        }));
    };

    const fetchDataUser = useCallback(async () => {
        setData((prev) => ({
            ...prev,
            dataWallet: [],
            loading: true,
        }));
        try {
            const params = {
                search: data.search,
                page: data.page,
                limit: data.limit
            };
            const responseUser = await fetchCustomerList(objectToQueryStringNullable(params));
            if (responseUser?.data.data && Array.isArray(responseUser.data.data)) {
                const userData = responseUser.data.data.map(mapUserData);
                const userPagination: Pagination = mapPaginationData(responseUser.data);
                setData((prev) => ({
                    ...prev,
                    loading: false,
                    dataWallet: userData,
                    total: userPagination.total ?? 0,
                    lastPage: userPagination.lastPage ?? 0,
                }));
            } else {
                setData((prev) => ({
                    ...prev,
                    loading: false,
                    dataWallet: []
                }));
            }
        } catch (error) {
            console.error("Failed to fetch relevant User:", error);
            setData((prev) => ({
                ...prev,
                loading: false,
                dataWallet: []
            }));
        } finally {
            setData((prev) => ({
                ...prev,
                loading: false,
            }));
        }
    }, [data.page, data.limit, data.search]);

    const fetchStats = async () => {
        setData((prev) => ({
            ...prev,
            loading: true,
        }));
        try {
            const responseDashboard = await fetchDashboard();
            if (responseDashboard?.data) {
                const statsData = responseDashboard.data;
                setData((prev) => ({
                    ...prev,
                    loading: false,
                    stats: {
                        totalBalance: statsData.totalBalance as string,
                        totalUser: statsData.totalUsers as string,
                    }
                }));
            } else {
                setData((prev) => ({
                    ...prev,
                    loading: false,
                }));
            }
        } catch (error) {
            console.error("Failed to fetch relevant stats:", error);
            setData((prev) => ({
                ...prev,
                loading: false,
            }));
        } finally {
            setData((prev) => ({
                ...prev,
                loading: false,
            }));
        }
    };

    useEffect(() => {
        const getOptionData = async () => {
            const fetchedDataOption = {
                bankOption: await fetchDataOption(OPTION_BANK),
            };
            setData((prev) => ({
                ...prev,
                bankOption: fetchedDataOption.bankOption,
            }))
        };

        if (isEmpty(data.bankOption)) {
            getOptionData();
        }
    }, []);

    useEffect(() => {
        fetchStats();
        fetchDataUser();
    }, [fetchDataUser]);

    return (
        <section className="my-16">
            <div className="relative bg-primary px-8 pt-12 min-h-[150px] overflow-hidden">
                <Image
                    src="/images/bg-jumbotron.png"
                    alt="footer-banner"
                    fill
                    objectFit="cover"
                    className="-z-10-2xl"
                />
                <div className="mx-auto relative z-10 px-[85px] mt-3">
                    <div className="flex flex-row sm:flex-col md:flex-row lg:gap-2 justify-center">
                        <Typography className="text-white text-center w-full sm:text-2xl lg:text-4xl xl:text-4xl font-bold">
                            Wallet
                        </Typography>
                    </div>
                </div>
            </div>
            <div className="container flex flex-col mx-auto gap-10">
                <Card className="flex flex-col gap-2 mt-10 p-5">
                    <div className="flex flex-row gap-4 p-5">
                        <Card className="flex flex-row gap-4 py-8 px-5">
                            <div className="p-4 flex flex-col justify-center bg-primary rounded-lg">
                                <Icon icon="streamline:wallet" width={36} height={36} className=" text-white" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <Typography className="text-lg text-gray">
                                    Total Uang
                                </Typography>
                                <Typography className="text-3xl text-black font-semibold">
                                    Rp {formatDecimalString(data.stats.totalBalance)}
                                </Typography>
                            </div>
                        </Card>
                        <Card className="flex flex-row gap-4 py-8 px-5">
                            <div className="p-4 flex flex-col justify-center bg-primary rounded-lg">
                                <Icon icon="ph:user-circle" width={36} height={36} className=" text-white" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <Typography className="text-lg text-gray">
                                    Total User
                                </Typography>
                                <Typography className="text-3xl text-black font-semibold">
                                    {data.stats.totalUser}
                                </Typography>
                            </div>
                        </Card>
                    </div>
                    <Typography className="text-sm text-black font-medium px-5">
                        Pencarian
                    </Typography>
                    <div className="flex flex-row gap-4 px-5 pb-5 pt-2">
                        <TextInput
                            placeholder="Cari"
                            startAdornmentIcon="mdi:magnify"
                            startAdornmentInteractive={false}
                            className=""
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                setData((prev) => ({
                                    ...prev,
                                    search: event.target.value
                                }))
                            }
                        />

                        <Button
                            variant="solid"
                            className=" text-white h-input-standard min-w-40"
                            onClick={handleOpenUserModal}
                        >
                            <Icon icon="ri:add-fill" width={16} height={16} />
                            Tambah User
                        </Button>
                    </div>
                    <div className="flex flex-col lg:gap-y-5 sm:gap-y-40 w-full lg:justify-start px-5">
                        <div className="w-full">
                            <div className="mt-4 w-full overflow-hidden rounded-lg border border-surface overflow-x-visible">
                                <table className="w-full overflow-x-visible">
                                    <thead className="border-b border-surface bg-surface-light text-sm font-medium text-foreground dark:bg-surface-dark">
                                        <tr>
                                            {TABLE_HEAD.map((head) => (
                                                <th key={head} className={`px-2.5 py-2 font-medium ${head === "Aksi" ? "text-center" : "text-left "}`}>
                                                    {head}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="group text-sm text-black dark:text-white">
                                        {data.dataWallet.map(
                                            (
                                                {
                                                    id,
                                                    full_name,
                                                    account_no,
                                                    account_type,
                                                    balance
                                                },
                                                index
                                            ) => (
                                                <tr key={index} className="border-b border-surface last:border-0">
                                                    <td className="p-3 min-w-48">
                                                        <Typography className="text-left text-text-gray-black">{full_name}</Typography>
                                                    </td>
                                                    <td className="p-3 w-fit">
                                                        <div className="flex flex-row justify-start items-center gap-3 w-fit">
                                                            <Avatar
                                                                src={
                                                                    data.bankOption?.find((option) => option.id === account_type)?.image ||
                                                                    "https://placehold.co/50"
                                                                }
                                                                alt="bank-img"
                                                                size="md"
                                                            />
                                                            <Typography className="text-left text-text-gray-black !leading-6">
                                                                {data.bankOption.find((option) => option.id === account_type)?.label ?? "No label found"}
                                                            </Typography>
                                                            <Typography className="text-left text-text-gray-black !leading-6">{account_no}</Typography>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 ">
                                                        <Typography className="text-left text-text-gray-black">Rp {formatDecimalString(balance ?? "0")}</Typography>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex flex-row gap-2 justify-center">
                                                            <Menu placement="bottom-end">
                                                                <Menu.Trigger>
                                                                    <div
                                                                        className="w-fit rounded-md bg-[#EFE2FF] mx-auto cursor-pointer p-2 "
                                                                    >
                                                                        <Icon icon="bi:three-dots" width="18" height="18" className="text-primary" />

                                                                    </div>
                                                                </Menu.Trigger>
                                                                <Menu.Content className="z-[60] mt-2">
                                                                    <Menu.Item onClick={() => {
                                                                        setUserModal((prev) => ({
                                                                            ...prev,
                                                                            id: id ?? "",
                                                                            account_no: account_no ?? "",
                                                                            isTransferOpen: true
                                                                        }))
                                                                    }}>
                                                                        Transfer
                                                                    </Menu.Item>
                                                                    <Menu.Item onClick={() => {
                                                                        setUserModal((prev) => ({
                                                                            ...prev,
                                                                            id: id ?? "",
                                                                            account_no: account_no ?? "",
                                                                            isTopUpOpen: true
                                                                        }))
                                                                    }}>
                                                                        Top Up
                                                                    </Menu.Item>
                                                                </Menu.Content>
                                                            </Menu>

                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <ModalAddUser
                        isOpen={createUserModal}
                        onClose={handleCloseUserModal}
                    />
                    <ModalTopUpUser
                        isOpen={userModal.isTopUpOpen}
                        onClose={handleCloseTopUpModal}
                        id={userModal.id}
                        account_no={userModal.account_no}
                    />
                    <ModalTransferUser
                        isOpen={userModal.isTransferOpen}
                        onClose={handleCloseTransferModal}
                        id={userModal.id}
                        account_no={userModal.account_no}
                    />

                    {/* Pagination */}
                    <PaginationComponent
                        count={data.lastPage}
                        page={data.page}
                        onPageChange={(page: number) => { handlePageChange(page) }}
                    />
                </Card>
            </div>
        </section>
    )
}