// prisma/initdb.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { fakerRU as faker } from "@faker-js/faker";

export async function initDb() {
    const userCount = await prisma.user.count();
    if (userCount > 0) return; // БД уже не пустая

    const adminPass = await bcrypt.hash("12345", 10);

    const admin = await prisma.user.create({
        data: {
            name: "admin",
            email: "admin@local.ru",
            passwordHash: adminPass,
            role: "ADMIN",
        },
    });

    const clients = await Promise.all(
        Array.from({ length: 10 }, () =>
            prisma.client.create({
                data: {
                    name: faker.person.fullName(),
                    phone: faker.phone.number(),
                    address: faker.location.streetAddress(),
                },
            })
        )
    );

    const products = await Promise.all(
        Array.from({ length: 20 }, () =>
            prisma.product.create({
                data: {
                    name: faker.commerce.productName(),
                    price: Number(faker.commerce.price({ min: 100, max: 5000 })),
                    stock: faker.number.int({ min: 1, max: 100 }),
                },
            })
        )
    );

    for (let i = 0; i < 5; i++) {
        const client = clients[i];
        const order = await prisma.order.create({
            data: {
                clientId: client.id,
                userId: admin.id,
                status: "NEW",
                total: 0,
            },
        });

        let total = 0;

        for (let j = 0; j < 3; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = faker.number.int({ min: 1, max: 3 });
            total += product.price * quantity;

            await prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: product.id,
                    quantity,
                    price: product.price,
                },
            });
        }

        await prisma.order.update({
            where: { id: order.id },
            data: { total },
        });
    }
}