import { Form, Head } from '@inertiajs/react';
import { ShoppingBag, Sparkles, UserCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Daftar Akun Pembeli (Client)" />

            <div className="mb-2 flex items-center justify-between rounded-lg border border-[#0099FF]/30 bg-[#E6F5FF] px-3.5 py-2.5 text-xs text-[#007ACC]">
                <div className="flex items-center gap-2 font-medium">
                    <UserCheck className="size-4 shrink-0 text-[#0099FF]" />
                    <span>Daftar sebagai <strong>Pembeli / Client Resmi</strong></span>
                </div>
                <span className="hidden sm:inline-block rounded bg-[#0099FF] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    Client
                </span>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-xs font-bold text-gray-700">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Contoh: Muhammad Ilham"
                                    className="focus:border-[#0099FF] focus:ring-[#0099FF]"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-1"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs font-bold text-gray-700">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="nama@email.com"
                                    className="focus:border-[#0099FF] focus:ring-[#0099FF]"
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-xs font-bold text-gray-700">Kata Sandi</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Minimal 8 karakter"
                                    passwordrules={passwordRules}
                                    className="focus:border-[#0099FF] focus:ring-[#0099FF]"
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-xs font-bold text-gray-700">
                                    Konfirmasi Kata Sandi
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Ulangi kata sandi"
                                    passwordrules={passwordRules}
                                    className="focus:border-[#0099FF] focus:ring-[#0099FF]"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-1"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full bg-[#0099FF] hover:bg-[#007ACC] text-white font-bold h-10 shadow-xs transition-colors"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                <ShoppingBag className="size-4 mr-1.5" />
                                Daftar Sebagai Pembeli
                            </Button>
                        </div>

                        <div className="text-center text-xs text-muted-foreground">
                            Sudah memiliki akun?{' '}
                            <TextLink href={login()} tabIndex={6} className="font-bold text-[#0099FF] hover:underline">
                                Masuk ke Akun
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Daftar Akun Pembeli (Client)',
    description: 'Daftar untuk menikmati belanja Pick N Go dan harga terbaik #SudahPastiMurahnya',
};
