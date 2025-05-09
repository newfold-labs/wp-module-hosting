import { __, sprintf } from '@wordpress/i18n';

const getDiskSpaceText = ( spaceAvailable ) => {

    return {
        title: __( 'Disk Space', 'wp-module-hosting' ),
        highCapacity: sprintf(
                /* translators: 1: Space available */
                __( 'You have %1$sGB of storage remaining.', 'wp-module-hosting' ),
                spaceAvailable,
            ),
        mediumCapacity: __( "You're nearing the storage limit that your plan is designed for.", 'wp-module-hosting' ),
        lowCapacity: __( "You're over the storage limit that your plan is designed for.", 'wp-module-hosting' ),
        button:  __( 'Change plan', 'wp-module-hosting' ),
        noInfoAvailable: __( 'No information available on disk space.', 'wp-module-hosting' )
    };
};

export default getDiskSpaceText;
