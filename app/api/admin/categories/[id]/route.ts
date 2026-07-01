import { NextResponse } from "next/server";
import { parseCategoryMutationInput, validateCategoryMutationInput } from "@/lib/admin-categories";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getCategoryId(context: RouteContext) {
  const params = await context.params;
  return params.id;
}

export async function PATCH(request: Request, context: RouteContext) {
  const { errorResponse } = await requireAdmin();

  if (errorResponse) {
    return errorResponse;
  }

  const categoryId = await getCategoryId(context);
  const body = await request.json().catch(() => null);
  const parsed = parseCategoryMutationInput(body);

  if ("error" in parsed) {
    return NextResponse.json(parsed, { status: 400 });
  }

  const existingCategory = await db.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!existingCategory) {
    return NextResponse.json({ error: "კატეგორია ვერ მოიძებნა." }, { status: 404 });
  }

  const validated = await validateCategoryMutationInput(parsed.data, categoryId);

  if ("error" in validated) {
    return NextResponse.json(validated, { status: 400 });
  }

  try {
    await db.category.update({
      where: { id: categoryId },
      data: {
        iconKey: validated.data.iconKey,
        isActive: validated.data.isActive,
        name: validated.data.name,
        parentId: validated.data.parentId,
        slug: validated.data.slug,
        sortOrder: validated.data.sortOrder,
      },
    });

    return NextResponse.json({ message: "კატეგორია წარმატებით განახლდა." });
  } catch {
    return NextResponse.json(
      { error: "კატეგორიის განახლება ვერ მოხერხდა. შესაძლოა category schema ჯერ არ არის დასინქრონებული." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { errorResponse } = await requireAdmin();

  if (errorResponse) {
    return errorResponse;
  }

  const categoryId = await getCategoryId(context);

  try {
    const deletedCategory = await db.category.delete({
      where: { id: categoryId },
      select: { id: true },
    });

    return NextResponse.json({ category: deletedCategory, message: "კატეგორია წაიშალა." });
  } catch {
    return NextResponse.json(
      { error: "კატეგორიის წაშლა ვერ მოხერხდა. გადაამოწმეთ დამოკიდებული ჩანაწერები და ბაზასთან კავშირი." },
      { status: 500 }
    );
  }
}
