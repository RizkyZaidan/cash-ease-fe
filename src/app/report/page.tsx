"use client";

import { fetchCustomerList } from "@/api/customer";
import { fetchDashboard } from "@/api/dashboard";
import { fetchBalanceList, fetchTopupList, fetchTransferList } from "@/api/report";
import DatePickerButton from "@/components/layouts/form/inputs/date-picker-button";
import TextInput from "@/components/layouts/form/inputs/text-input";
import PaginationComponent from "@/components/layouts/form/paginations/pagination";
import TabContent from "@/components/layouts/tabbed-data/tab-content";
import TabSwitcher from "@/components/layouts/tabbed-data/tab-switcher";
import { fetchDataOption, formatDecimalString, isEmpty, mapBalanceData, mapPaginationData, mapTopUpData, mapTransferData, mapUserData, objectToQueryStringNullable } from "@/components/utility";
import { OPTION_BANK } from "@/constants";
import { useTabStore } from "@/lib/tab-store";
import { Balance, Option, Pagination, TopUp, Transfer, User } from "@/structures/interfaces";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar, Button, Card, Typography } from "@material-tailwind/react";
import { format } from "date-fns";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";


const TABLE_HEAD: { [key: string]: string[] } = {
    "balance": [
        "Nama",
        "Tanggal",
        "Bank",
        "Saldo",
    ],
    "top-up": [
        "Nama",
        "Tanggal",
        "Nominal",
    ],
    "transfer": [
        "Nama Pengirim",
        "Nama Penerima",
        "Tanggal",
    ],
};

export default function Report() {
    const [prevContent, setPrevContent] = useState<React.ReactNode>(null);
    const activeTab = useTabStore(state => state.contexts.report?.activeTab);
    const [data, setData] = useState<{
        stats: {
            totalBalance: string,
            totalUser: string
        },
        date: string | null,
        search: string,
        total: number,
        lastPage: number,
        limit: number,
        page: number,
        bankOption: Option[],
        data: Balance[] | TopUp[] | Transfer[],
        loading: boolean
    }>({
        stats: {
            totalBalance: "0",
            totalUser: "0"
        },
        date: null,
        search: "",
        limit: 5,
        page: 1,
        total: 0,
        lastPage: 1,
        data: [],
        bankOption: [],
        loading: true
    });
    const listMenu = [
        { id: "balance", name: "Saldo" },
        { id: "top-up", name: "Top Up" },
        { id: "transfer", name: "Transfer" },
    ];
    let content;

    const onClickMenu = (tab: string | null) => {
        setPrevContent(renderContent()); // Save current content as previous
        // No additional data fetching assumed since no dataStats or async calls mentioned
    };

    const handleSearch = async () => {
        fetchData();
    };

    const handlePageChange = (page: number) => {
        setData((prev) => ({
            ...prev,
            page: page,
            loading: true
        }));
    };

    const fetchData = useCallback(async () => {
        setData((prev) => ({
            ...prev,
            data: [],
            loading: true,
        }));
        try {
            const params = {
                search: data.search ?? null,
                page: data.page ?? null,
                limit: data.limit ?? null,
                filterDate: data.date ?? null,
            };

            let responseData
            let dataMapper

            switch (activeTab) {
                case "top-up":
                    responseData = await fetchTopupList(objectToQueryStringNullable(params));
                    dataMapper = mapTopUpData
                    break;
                case "transfer":
                    responseData = await fetchTransferList(objectToQueryStringNullable(params));
                    dataMapper = mapTransferData
                    break;
                case "balance":
                default:
                    responseData = await fetchBalanceList(objectToQueryStringNullable(params));
                    dataMapper = mapBalanceData
                    break;
            }

            if (responseData?.data.data && Array.isArray(responseData.data.data)) {
                const userData = responseData.data.data.map(dataMapper);
                const userPagination: Pagination = mapPaginationData(responseData.data);
                setData((prev) => ({
                    ...prev,
                    loading: false,
                    data: userData,
                    total: userPagination.total ?? 0,
                    lastPage: userPagination.lastPage ?? 0,
                }));
            } else {
                setData((prev) => ({
                    ...prev,
                    loading: false,
                    data: []
                }));
            }
        } catch (error) {
            console.error("Failed to fetch relevant data:", error);
            setData((prev) => ({
                ...prev,
                loading: false,
                data: []
            }));
        } finally {
            setData((prev) => ({
                ...prev,
                loading: false,
            }));
        }
    }, [data.page, data.limit, data.search, data.date, activeTab]);

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

    const renderContent = () => {
        switch (activeTab) {
            case 'balance':
            default:
                return (
                    <>
                        <table className="w-full overflow-x-visible">
                            <thead className="border-b border-surface bg-surface-light text-sm font-medium text-foreground dark:bg-surface-dark">
                                <tr>
                                    {TABLE_HEAD[activeTab].map((head: string) => (
                                        <th key={head} className={`px-2.5 py-2 font-medium ${head === "Aksi" ? "text-center" : "text-left "}`}>
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="group text-sm text-black dark:text-white">
                                {data.data.map((row, index) => {
                                    const balanceRow = row as Balance;

                                    return (
                                        <tr key={index} className="border-b border-surface last:border-0">
                                            <td className="p-3 min-w-48">
                                                <Typography className="text-left text-text-gray-black">{balanceRow.full_name}</Typography>
                                            </td>
                                            <td className="p-3 ">
                                                <Typography className="text-left text-text-gray-black">{balanceRow.date}</Typography>
                                            </td>
                                            <td className="p-3 w-fit">
                                                <div className="flex flex-row justify-start items-center gap-3 w-fit">
                                                    <Avatar
                                                        src={
                                                            data.bankOption?.find((option) => option.id === balanceRow.account_type)?.image ||
                                                            "https://placehold.co/50"
                                                        }
                                                        alt="bank-img"
                                                        size="md"
                                                    />
                                                    <Typography className="text-left text-text-gray-black !leading-6">
                                                        {data.bankOption.find((option) => option.id === balanceRow.account_type)?.label ?? "No label found"}
                                                    </Typography>
                                                    <Typography className="text-left text-text-gray-black !leading-6">{balanceRow.account_no}</Typography>
                                                </div>
                                            </td>
                                            <td className="p-3 ">
                                                <Typography className="text-left text-text-gray-black">
                                                    Rp {formatDecimalString(balanceRow.balance ?? "0")}
                                                </Typography>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )
                break;
            case 'top-up':
                return <>
                    <table className="w-full overflow-x-visible">
                        <thead className="border-b border-surface bg-surface-light text-sm font-medium text-foreground dark:bg-surface-dark">
                            <tr>
                                {TABLE_HEAD[activeTab].map((head: string) => (
                                    <th key={head} className={`px-2.5 py-2 font-medium ${head === "Aksi" ? "text-center" : "text-left "}`}>
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="group text-sm text-black dark:text-white">
                            {data.data.map((row, index) => {
                                const topUpRow = row as TopUp;

                                return (
                                    <tr key={index} className="border-b border-surface last:border-0">
                                        <td className="p-3 min-w-48">
                                            <Typography className="text-left text-text-gray-black">{topUpRow.full_name}</Typography>
                                        </td>
                                        <td className="p-3 ">
                                            <Typography className="text-left text-text-gray-black">{topUpRow.date}</Typography>
                                        </td>
                                        <td className="p-3 ">
                                            <Typography className="text-left text-text-gray-black">
                                                Rp {formatDecimalString(topUpRow.amount ?? "0")}
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
                break;
            case 'transfer':
                return (
                    <>
                        <table className="w-full overflow-x-visible">
                            <thead className="border-b border-surface bg-surface-light text-sm font-medium text-foreground dark:bg-surface-dark">
                                <tr>
                                    {TABLE_HEAD[activeTab].map((head: string) => (
                                        <th key={head} className={`px-2.5 py-2 font-medium ${head === "Aksi" ? "text-center" : "text-left "}`}>
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="group text-sm text-black dark:text-white">
                                {data.data.map((row, index) => {
                                    const transferRow = row as Transfer;

                                    return (
                                        <tr key={index} className="border-b border-surface last:border-0">
                                            <td className="p-3 min-w-48">
                                                <Typography className="text-left text-text-gray-black">{transferRow.nama_pengirim}</Typography>
                                            </td>
                                            <td className="p-3 min-w-48">
                                                <Typography className="text-left text-text-gray-black">{transferRow.nama_penerima}</Typography>
                                            </td>
                                            <td className="p-3 ">
                                                <Typography className="text-left text-text-gray-black">{transferRow.date}</Typography>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )
                break;
        }
    }

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
        fetchData();
    }, [fetchData]);
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
                            Laporan
                        </Typography>
                    </div>
                </div>
            </div>
            <div className="container flex flex-col mx-auto mt-16">
                <TabSwitcher
                    tabs={listMenu}
                    onTabChange={onClickMenu}
                    showAllTab={false}
                    loading={data.loading}
                    showTabStats={false}
                    context="report"
                />
                <Card className="flex flex-col gap-2 p-5">
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
                        <div className="flex flex-row gap-1">
                            <DatePickerButton
                                value={data.date}
                                onDaysButtonTriggered={(date) => {
                                    setData((prev: any) => ({
                                        ...prev,
                                        date: date ? format(date, "dd-MM-yyyy") : null
                                    }));
                                }}
                                placeholder="Tanggal"
                                disabledDays={{ before: new Date(2000, 0, 1) }}
                            />
                            <Button
                                className={`h-input-standard ${data.date !== null ? "block" : "hidden"}`}
                                onClick={() => {
                                    setData((prev) => ({
                                        ...prev,
                                        date: null

                                    }))
                                }}
                            >
                                <Icon icon="heroicons:x-mark-16-solid" className="w-5 h-5 text-white" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col lg:gap-y-5 sm:gap-y-40 w-full lg:justify-start px-5">
                        <div className="w-full">
                            <div className="mt-4 w-full overflow-hidden rounded-lg border border-surface overflow-x-visible">
                                <TabContent
                                    content={renderContent()}
                                    prevContent={prevContent || renderContent()}
                                    context="report"
                                />
                            </div>
                        </div>
                    </div>

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