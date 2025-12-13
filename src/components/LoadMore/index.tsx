"use client";

import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import React from "react";

const LoadMore = ({ hasNextPage, isFetchingNextPage, fetchNextPage }: { hasNextPage: boolean, isFetchingNextPage: boolean, fetchNextPage: any }) => {
    const t = useTranslations("common");
    if (!hasNextPage) return <></>;
    return (
        <div className="flex items-end justify-center p-4 border-t border-white/5">
            <Button
                size="sm"
                radius="full"
                variant="light"
                color="warning"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
            >
                {isFetchingNextPage ? t("loading_more") : t("load_more")}
            </Button>
        </div>
    );
};

export default LoadMore;
