import Link from 'next/link';
import { ChatIcon, SealQuestionIcon, UsersIcon } from '@phosphor-icons/react/dist/ssr';

export default function SupportNeedMore() {
  return (
    <section className="py-20 max-w-5xl mx-auto grid grid-cols-3 gap-x-8 gap-y-12">
      <header className="col-span-3">
        <h2 className="text-3xl font-semibold mb-4">Couldn't find what you needed?</h2>
        <p className="font-medium">Don’t worry, we’ve got more options for you</p>
      </header>
      <Link
        className="px-8 min-h-60 bg-brand-blue-500 text-white flex flex-col justify-center gap-4 rounded-lg hover:shadow hover:bg-brand-blue-500/90"
        href="https://forums.intuipay.xyz"
        target="_blank"
      >
        <UsersIcon size={32} />
        <h3 className="text-xl font-semibold">Forums</h3>
        <p className="font-medium leading-normal">Chat together with the Intuipay community.</p>
      </Link>
      <Link
        className="px-8 min-h-60 bg-brand-blue-500 text-white flex flex-col justify-center gap-4 rounded-lg hover:shadow hover:bg-brand-blue-500/90"
        href="https://forums.intuipay.xyz"
        target="_blank"
      >
        <SealQuestionIcon size={32} />
        <h3 className="text-xl font-semibold">Common questions</h3>
        <p className="font-medium leading-normal">What people most asked about Intuipay.</p>
      </Link>
      <Link
        className="px-8 min-h-60 bg-brand-blue-500 text-white flex flex-col justify-center gap-4 rounded-lg hover:shadow hover:bg-brand-blue-500/90"
        href="mailto:support@intuipay.xyz"
        target="_blank"
      >
        <ChatIcon size={32} />
        <h3 className="text-xl font-semibold">Contact support</h3>
        <p className="font-medium leading-normal">Our support team is ready to assist 24/7.</p>
      </Link>
    </section>
  );
}
