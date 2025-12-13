import { useMemo } from "react"
import { Address, erc20Abi, zeroAddress, } from "viem"
import { useReadContracts } from "wagmi"

import { TokenType } from "@/types/token/type"

export const useContractType = (address: Address, chainId: number) => {
    const { data, error, isFetched } = useReadContracts({
        contracts: [
            {
                chainId: chainId,
                abi: erc20Abi,
                address: address,
                functionName: 'balanceOf',
                args: [zeroAddress],
            },
            {
                chainId: chainId,
                abi: erc20Abi,
                address: address,
                functionName: 'name',
                args: [],
            }, {
                chainId: chainId,
                abi: erc20Abi,
                address: address,
                functionName: 'symbol',
                args: [],
            }]
    })


    const isERC20 = (data?.find((x: { status: string }, index: number) => index > 1 && x.status == 'failure') !== undefined);
    return {
        error,
        data,
        result: useMemo(() => ({
            state: isFetched && (isERC20),
            name: data?.[1].result,
            symbol: data?.[2].result,
            address: address,
            chainId: chainId,
            type: isERC20 ? TokenType.ERC20 : null
        }), [address, chainId, data, isFetched, isERC20]),
    }
}
