import { ComponentPropsWithRef, PropsWithChildren } from "react";
import DetailsPageHead from "src/components/DetailsPage/DetailsPageHead";
import DetailsPageHeadTitle from "src/components/DetailsPage/DetailsPageHeadTitle";
import AvatarSection from "../components/Avatar";

type UserDetails_HeadSection = {
	user: any;
};

export type UserDetailsHeadSection = UserDetails_HeadSection &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof UserDetails_HeadSection>;

function CompanyDetailsHeadSection({ className, user, ...props }: UserDetailsHeadSection) {
	return (
		<DetailsPageHead {...props}>
			<AvatarSection user={user} />
			<DetailsPageHeadTitle>{user.username}</DetailsPageHeadTitle>
		</DetailsPageHead>
	);
}

export default CompanyDetailsHeadSection;
