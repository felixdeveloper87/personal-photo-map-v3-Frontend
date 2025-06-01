import { Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
    FaSignInAlt,
    FaSignOutAlt,
    FaUserPlus,
    FaStream,
    FaSearch,
    FaUsers,
    FaCloudUploadAlt,
    FaChartLine 
} from "react-icons/fa";

const MotionButton = motion(Button);

const BaseButton = ({
    children,
    icon,
    gradient = "teal",
    variant = "solid",
    ...props
}) => {
    const gradients = {
        teal: {
            bg:"linear(to-r, teal.400, teal.600)",
            hover: "linear(to-r, teal.500, teal.700)",
        },
        blue: {
            bg: "linear(to-r, blue.400, blue.600)",
            hover: "linear(to-r, blue.500, blue.700)",
            color: "white"
        },
        red: {
            bg: "linear(to-r, red.400, red.600)",
            hover: "linear(to-r, red.500, red.700)",
            color: "white"
        },
        yellow: {
            bg: "linear(to-r, yellow.300, yellow.500)",
            hover: "linear(to-r, yellow.400, yellow.600)",
            color: "black"
        }
    };

    const g = gradients[gradient];

    return (
        <MotionButton
            leftIcon={icon}
            variant={variant}
            size="md"
            bgGradient={variant === "solid" ? g.bg : undefined}
            color={variant === "solid" ? g.color : g.hover}
            borderColor={variant === "outline" ? g.hover : undefined}
            _hover={{
                bgGradient: variant === "solid" ? g.hover : undefined,
                bg: variant === "outline" ? `${gradient}.50` : undefined,
                boxShadow: "xl",
                transform: "scale(1.05)"
            }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {children}
        </MotionButton>
    );
};

// Exportando botões prontos
export const SignInButton = (props) => (
    <BaseButton icon={<FaSignInAlt />} gradient="blue" {...props}>
        Log in
    </BaseButton>
);

export const SignUpButton = (props) => (
    <BaseButton icon={<FaUserPlus />} gradient="blue" {...props}>
        Register
    </BaseButton>
);

export const SignOutButton = (props) => (
    <BaseButton icon={<FaSignOutAlt />} gradient="red" {...props}>
        Sign out
    </BaseButton>
);

export const TimelineButton = (props) => (
    <BaseButton icon={<FaStream />} gradient="teal" {...props}>
        Timeline
    </BaseButton>
);

export const SearchButton = (props) => (
    <BaseButton icon={<FaSearch />} bgGradient="teal" {...props}>
        Search
    </BaseButton>
);

export const SocialInfoButton = (props) => (
    <BaseButton icon={<FaUsers />} gradient="teal" {...props}>
        Social Info
    </BaseButton>
);
export const UpgradeToPremiumButton = (props) => (
    <BaseButton gradient="yellow" fontSize="lg" {...props}>
        Upgrade to Premium 🌟
    </BaseButton>
);
export const UploadButton = (props) => (
    <BaseButton
        icon={<FaCloudUploadAlt />}
        gradient="teal"
        width="100%"
        {...props}
    >
        Upload
    </BaseButton>
);

export const EconomicInfoButton = (props) => (
  <BaseButton icon={<FaChartLine />} gradient="teal" {...props}>
    Economic Info
  </BaseButton>
);

