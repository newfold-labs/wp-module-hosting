import { Card, Button, Link } from '@newfold/ui-component-library';

const SiteStatusCard = ( {
	title,
	status,
	description,
	primaryButtonText,
	primaryButtonAction,
	primaryButtonDisabled = false,
	primaryButtonContent = null,
	secondaryButtonText,
	secondaryButtonAction,
	linkHref,
	linkText,
	Illustration,
} ) => {
	return (
		<Card className="nfd-min-h-[208px] nfd-p-4 nfd-border nfd-border-gray-200 nfd-rounded-lg">
			<div className="nfd-flex nfd-justify-between nfd-items-center">
				<h3 className="nfd-text-lg nfd-font-medium">{ title }</h3>
				{ linkHref && (
					<Link
						href={ linkHref }
						target="_blank"
						rel="noopener noreferrer"
						className="nfd-text-primary nfd-text-sm nfd-no-underline"
					>
						{ linkText }
					</Link>
				) }
			</div>

			<div className="nfd-flex nfd-items-center nfd-gap-2 nfd-mt-7">
				{ Illustration && (
					<div className="nfd-w-[48px] nfd-h-[48px]">
						{ typeof Illustration === 'function' ? (
							<Illustration />
						) : (
							<Illustration width={ 48 } height={ 48 } />
						) }
					</div>
				) }
				<div>
					<p className="nfd-font-semibold">{ status }</p>
					<p className="nfd-text-sm nfd-text-gray-500">
						{ description }
					</p>
				</div>
			</div>

			<div className="nfd-flex nfd-gap-4 nfd-mt-10">
				{ primaryButtonText && (
					<Button
						variant="primary"
						className="nfd-w-fit"
						onClick={ primaryButtonAction }
						disabled={ primaryButtonDisabled }
					>
						{ primaryButtonContent || primaryButtonText }
					</Button>
				) }

				{ secondaryButtonText && (
					<Button
						variant="secondary"
						className="nfd-w-fit"
						onClick={ secondaryButtonAction }
					>
						{ secondaryButtonText }
					</Button>
				) }
			</div>
		</Card>
	);
};

export default SiteStatusCard;
