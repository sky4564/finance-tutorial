"use client"

import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet"

import { useMountedState } from "react-use"

import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet"


import { useEffect, useState } from "react"

export const SheetProvider = () => {
    // 이걸로 hydration
    // const isMounted = useMountedState()


    // 위 한줄로 이 밑에 효과를 낼수있다.
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    return (
        <>
            <NewAccountSheet />
            <EditAccountSheet />
        </>
    )
}