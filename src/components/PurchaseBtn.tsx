"use client";
import { useRouter } from 'next/navigation';
import { subscribeAction } from '@/actions/stripe';

interface PurchaseBtnProps {
  user: any;
  priceId: string;
  btnText: string;
  className?: string;
}

export default function PurchaseBtn({ user, priceId, btnText, className }: PurchaseBtnProps) {
  const router = useRouter();
  const processSubscription = async (priceId: string) => {
    const response = await subscribeAction({
      userId: user?.id,
      priceId: priceId,
    });

    if (response) {
      router.push(response);
    } else {
      console.error("Subscription failed");
    }
  };

  const handlePriceBtn = async () => {
      await processSubscription(priceId);
  };

  return (
    <button
      className={className}
      onClick={handlePriceBtn}
    >
      {btnText}
    </button>
  );
}
