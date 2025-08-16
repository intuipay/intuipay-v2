import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Availabilities } from "@/data";
import { getRewardShipMethodLabel } from "@/lib/utils";
import { RewardDraft } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Reward({
  id,
  projectName,
  title,
  amount,
  description,
  image,
  ship_method,
  month,
  year,
  availability,
  number,
  count = 0,
}: RewardDraft & {
  projectName: string;
}) {
  const getAvailabilityText = () => {
    if (availability === Availabilities.Unlimited.toString())
      return "Unlimited";
    else return `Limited (${number - count} left of ${number})`;
  };

  return (
    <Card className="w-full !min-h-56 p-4">
      <CardContent className="h-full p-0">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 w-full rounded">
            {image ? (
              <Image
                src={image}
                alt={title}
                width={258}
                height={172}
                className="h-44 object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium leading-tight">{title}</h3>
                <div className="text-sm font-medium">${amount}</div>
              </div>

              <p className="font-normal text-xs leading-relaxed">
                {description}
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between font-medium text-xs">
                  <span>Shipping method</span>
                  <span>Estimated delivery</span>
                </div>
                <div className="flex justify-between font-normal text-xs">
                  <span>
                    {getRewardShipMethodLabel(ship_method.toString())}
                  </span>
                  <span>{`${month} ${year}`}</span>
                </div>
              </div>
              {availability && (
                <div className="space-y-1">
                  <h4 className="font-medium text-xs">Availability</h4>
                  <span className="font-normal text-xs">
                    {getAvailabilityText()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-auto flex justify-end mt-2">
          <Button
            asChild
            className="w-auto h-9 rounded-full bg-primary hover:bg-primary/90 text-base px-4 py-2"
            size="lg"
          >
            <Link href={`/donate/${projectName}?reward_id=${id}`}>
              Pledge ${amount}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default Reward;
