import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { MailModule } from "@src/modules/mail/mail.module";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { AuthMailDeliveryService } from "./auth-mail-delivery.service";
import { AuthService } from "./auth.service";
import { UserModule } from "@src/modules/user/user.module";

@Module({
    providers: [
        // only and ugly way to make it global using DI
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        AuthService,
        AuthMailDeliveryService,
    ],
    imports: [MailModule, UserModule],
    controllers: [AuthController],
    exports: [AuthService, AuthMailDeliveryService],
})
export class AuthModule {}
