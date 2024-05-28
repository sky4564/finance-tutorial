import { UserButton } from "@clerk/nextjs";

const TestPage = () => {
    return (
        <UserButton afterSignOutUrl="/" />
    );
};

export default TestPage