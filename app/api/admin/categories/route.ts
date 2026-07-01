import { NextResponse } from "next/server";
import { parseCategoryMutationInput, validateCategoryMutationInput } from "@/lib/admin-categories";
import { getAdminCategoryTreeResult } from "@/lib/catalog-category-tree";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const { errorResponse } = await requireAdmin();

  if (errorResponse) {
    return errorResponse;
  }

  try {
    const result = await getAdminCategoryTreeResult();

    return NextResponse.json(
      {
        categories: result.categories,
        source: result.source,
        warning: result.warning,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { error: "კატეგორიების წამოღება ვერ მოხერხდა. გადაამოწმეთ ბაზასთან კავშირი და category schema." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { errorResponse } = await requireAdmin();

  if (errorResponse) {
    return errorResponse;
  }

  const body = await request.json().catch(() => null);
  const parsed = parseCategoryMutationInput(body);

  if ("error" in parsed) {
    return NextResponse.json(parsed, { status: 400 });
  }

  const validated = await validateCategoryMutationInput(parsed.data);

  if ("error" in validated) {
    return NextResponse.json(validated, { status: 400 });
  }

  try {
    const category = await db.category.create({
      data: {
        iconKey: validated.data.iconKey,
        isActive: validated.data.isActive,
        name: validated.data.name,
        parentId: validated.data.parentId,
        slug: validated.data.slug,
        sortOrder: validated.data.sortOrder,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(
      { category, message: "კატეგორია წარმატებით დაემატა." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "კატეგორიის დამატება ვერ მოხერხდა. შესაძლოა category schema ჯერ არ არის დასინქრონებული." },
      { status: 500 }
    );
  }
}
