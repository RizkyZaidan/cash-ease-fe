"use client";
import { authUser } from "@/api/auth";
import { useToastify } from "@/components/toastify-provider/toastify-provider";
import { isEmpty, jwtToJson, retryRequest } from "@/components/utility";
import { toastConfig, TOASTIFY_ERROR } from "@/constants";
import { useAuthStore } from "@/lib/auth-store";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Card, CardBody, CardHeader, Input, Typography } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { showToast } = useToastify();
  const router = useRouter();
  const { sessionExpired, isUnauthorize, setSessionExpired, setIsUnauthorize } = useAuthStore.getState();
  const [form, setForm] = useState<{
    username: string,
    password: string
  }>({
    username: "",
    password: "",
  });
  const [validation, setValidation] = useState({
    username: {
      isNotValid: false,
      message: "",
    },
    password: {
      isNotValid: false,
      message: "",
    },
  });
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    // Validate inputs
    setValidation({
      username: {
        isNotValid: isEmpty(form.username),
        message: isEmpty(form.username) ? "Mohon Isi Username" : "",
      },
      password: {
        isNotValid: isEmpty(form.password),
        message: isEmpty(form.password) ? "Mohon Isi Password" : "",
      },
    });

    // If any field invalid, return early
    if (isEmpty(form.username) || isEmpty(form.password)) return;

    setLoading(true);

    try {
      const res = await authUser(form);
      const data = res?.data;
      const dataJwt = jwtToJson(res?.data?.accessToken);
      const jwt = res?.data?.accessToken;

      if ((res.status === 200 || res.status === 201) && dataJwt) {
        useAuthStore.getState().updateAuth({
          token: jwt,
          userId: dataJwt.user_id,
        });
        router.push("/wallet");
      } else {
        showToast({
          type: TOASTIFY_ERROR,
          message: res.data?.message || 'Gagal mendapatkan User Detail.',
          config: toastConfig
        });
        // Clear Zustand stores on failure
        useAuthStore.getState().clearAuth();
        console.error("Failed to authenticate:", res);
      }
    } catch (error: any) {
      showToast({
        type: TOASTIFY_ERROR,
        message: error.response?.data?.message || 'An error occurred during authentication. Please try again later.',
        config: toastConfig
      });
      console.error("Error during authentication:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(function () {
    // Get the current state from Zustand store
    if (sessionExpired === true) {
      showToast({
        type: TOASTIFY_ERROR,
        message: 'Sesi Anda Berakhir, Harap Masuk!',
        config: toastConfig
      });
      // Clear the flag in Zustand store after showing toast to prevent showing it again on refresh
      setSessionExpired(false);
    }
    if (isUnauthorize === true) {
      showToast({
        type: TOASTIFY_ERROR,
        message: 'Harap Masuk Terlebih Dahulu!',
        config: toastConfig
      });
      // Clear the flag in Zustand store after showing toast to prevent showing it again on refresh
      setIsUnauthorize(false);
    }
  }, []);

  return (
    <section className="flex items-center justify-center min-h-screen">
      <Card className="lg:w-[36rem] md:w-[28rem] sm:w-[20rem] shadow-md mx-auto relative text-white">
        <CardHeader className="relative my-0 w-full mx-0 rounded-b-none sm:h-24 md:h-36">
          <Image
            layout="fill"
            style={{ objectFit: "cover", objectPosition: "right center" }}
            src="/images/bg-jumbotron.png"
            alt="login-banner"
            className="object-cover rounded-t-2xl rounded-b-none"
          />
          <div className="absolute md:top-10 sm:top-5 left-5 ">
            <Typography
              variant="h4"
              className="pb-1 text-white font-semibold text-3xl sm:text-xl md:text-2xl lg:text-3xl"
            >
              Masuk
            </Typography>
            <Typography
              className="font-normal text-white sm:text-xs md:text-sm lg:text-md"
              children={
                "Cash Easy, Your Fund Manager"
              }
            />
          </div>
        </CardHeader>
        <CardBody className="flex-col justify-center w-full ">
          <div className="w-[100%] space-y-5 mt-12 mb-20">
            <div>
              <Typography className="font-normal text-black pl-1 sm:text-sm lg:text-md leading-6 pb-1">
                Username
              </Typography>
              <Input
                placeholder="Masukan Username Anda"
                type="username"
                name="username"
                value={form.username}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setForm((prev) => ({
                    ...prev,
                    username: event.target.value,
                  }));
                }}
              />
              {validation.username.isNotValid && (
                <Typography className="font-normal text-danger pl-1 sm:text-xs lg:text-sm">
                  {validation.username.message}
                </Typography>
              )}
            </div>
            <div>
              <Typography className="font-normal text-black pl-1 sm:text-sm lg:text-md leading-6 pb-1">
                Password
              </Typography>
              <Input
                placeholder="Masukan Password"
                className=" "
                type="password"
                name="password"
                value={form.password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }));
                }}
              />
              {validation.password.isNotValid && (
                <Typography className="font-normal text-danger pl-1 sm:text-xs lg:text-sm">
                  {validation.password.message}
                </Typography>
              )}
            </div>
          </div>
          <div className="mt-5 flex-row lg:space-y-5 sm:space-y-2 pb-4 ">
            <Button
              isFullWidth
              className="bg-primary sm:mb-3 lg:mb-0 flex items-center justify-center"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <Icon
                  icon="ph:spinner"
                  className="animate-spin h-5 w-5 text-white"
                />
              ) : (
                <Typography
                  variant="small"
                  className="font-semibold text-white sm:text-sm lg:text-md"
                >
                  Masuk
                </Typography>
              )}
            </Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
