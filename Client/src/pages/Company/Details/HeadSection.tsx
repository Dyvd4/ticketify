import { ComponentPropsWithRef, PropsWithChildren } from "react";
import DetailsPageHead from "src/components/DetailsPage/DetailsPageHead";
import DetailsPageHeadAvatar from "src/components/DetailsPage/DetailsPageHeadAvatar";
import DetailsPageHeadTitle from "src/components/DetailsPage/DetailsPageHeadTitle";

type _CompanyDetailsHeadSectionProps = {
	company: any;
};

export type CompanyDetailsHeadSectionProps = _CompanyDetailsHeadSectionProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _CompanyDetailsHeadSectionProps>;

function CompanyDetailsHeadSection({
	className,
	company,
	...props
}: CompanyDetailsHeadSectionProps) {
	return (
		<DetailsPageHead {...props}>
			<DetailsPageHeadAvatar name={company.name} src={company.avatar?.file?.url} />
			<DetailsPageHeadTitle>{company.name}</DetailsPageHeadTitle>
		</DetailsPageHead>
	);
}

export default CompanyDetailsHeadSection;
