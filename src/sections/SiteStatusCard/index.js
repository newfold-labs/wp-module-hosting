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
	testId, // <-- added
} ) => {
	return (
		<Card
			className="nfd-min-h-[208px] nfd-p-6 nfd-border nfd-border-gray-200 nfd-rounded-lg"
			data-testid={ testId }
		>
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
							<span data-testid={ `${ testId }-status-icon` }>
								<Illustration />
							</span>
						) : typeof Illustration === 'object' ? (
							<>
								{Illustration}
							</>
						) : (
							<span data-testid={ `${ testId }-status-icon` }>
								<Illustration width={ 48 } height={ 48 } />
							</span>
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
						data-testid={ `${ testId }-scan-button` }
					>
						{ primaryButtonContent || primaryButtonText }
					</Button>
				) }

				{ secondaryButtonText && (
					<Button
						variant="secondary"
						className="nfd-w-fit"
						onClick={ secondaryButtonAction }
						data-testid={ `${ testId }-support-button` }
					>
						{ secondaryButtonText }
					</Button>
				) }
			</div>
		</Card>
	);
};

export default SiteStatusCard;
