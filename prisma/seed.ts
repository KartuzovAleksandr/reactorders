// import { prisma } from "@/lib/prisma";
// ✅ Относительный путь:
import { prisma } from "src/lib/prisma";
import bcrypt from "bcryptjs";
import { fakerRU as faker } from "@faker-js/faker";

async function main() {
    const adminPass = await bcrypt.hash("12345", 10);

    await prisma.user.upsert({
        where: { email: "admin@ya.ru" },
        update: {},
        create: {
            name: "admin",
            email: "admin@ya.ru",
            passwordHash: adminPass,
            role: "ADMIN"
        }
    });

    await prisma.user.upsert({
        where: { email: "sales@ya.ru" },
        update: {},
        create: {
            name: "sales",
            email: "sales@ya.ru",
            passwordHash: adminPass,
            role: "SALES"
        }
    });

    await prisma.user.upsert({
        where: { email: "manager@ya.ru" },
        update: {},
        create: {
            name: "manager",
            email: "manager@ya.ru",
            passwordHash: adminPass,
            role: "MANAGER"
        }
    });

    for (let i = 0; i < 10; i++) {
        await prisma.client.create({
            data: {
                name: faker.person.fullName(),
                phone: faker.phone.number(),
                address: faker.location.streetAddress()
            }
        });
    }

    const products = [];
    const names = ["IQOO 15", "Apple 17", "Samsung A27", "Tecno Spark", "Realme GT3", "Samsung S25", "Redmi K90", "Infinix 60",
                          "Honor 90s", "Huawei", "Samsung A36", "Samsung A57"];
    for (let i = 0; i < 7; i++) {
        products.push(
            await prisma.product.create({
                data: {
                    name: names[faker.number.int({ min: 0, max: names.length - 1 })],
                    price: Number(faker.commerce.price({ min: 20000, max: 100000 })),
                    stock: faker.number.int({ min: 1, max: 100 })
                }
            })
        );
    }

    const clients = await prisma.client.findMany();
    const admin = await prisma.user.findUnique({ where: { email: "admin@ya.ru" } });

    if (admin) {
        for (let i = 0; i < 5; i++) {
            const client = clients[i];
            const order = await prisma.order.create({
                data: {
                    clientId: client.id,
                    userId: admin.id,
                    status: "NEW",
                    total: 0
                }
            });

            let total = 0;
            const amount = Math.floor(Math.random() * 5) + 1;
            for (let j = 0; j < amount; j++) {
                const product = products[Math.floor(Math.random() * products.length)];
                const quantity = faker.number.int({ min: 1, max: 3 });
                total += product.price * quantity;

                await prisma.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: product.id,
                        quantity,
                        price: product.price
                    }
                });
            }

            await prisma.order.update({
                where: { id: order.id },
                data: { total }
            });
        }
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });