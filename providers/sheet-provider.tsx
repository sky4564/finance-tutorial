"use client"

import { useMountedState } from "react-use"

import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet"
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet"
import { NewCategorySheet } from "@/features/categories/components/new-category-sheet"
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet"


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
            <NewCategorySheet/>
            <EditCategorySheet/>
        </>
    )
}