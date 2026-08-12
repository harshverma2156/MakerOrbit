<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // `price` (existing column) is the current selling price;
            // `mrp` is the "real"/original price used to show a strike-
            // through and a computed discount percentage. Nullable: if
            // unset, no discount is shown.
            $table->decimal('mrp', 10, 2)->nullable()->after('price');

            // Short bullet-point highlights, distinct from the free-form
            // `description` and the structured `specs` JSON.
            $table->json('features')->nullable()->after('description');

            // Link to a fuller spec sheet/datasheet, e.g. a manufacturer
            // page or a hosted PDF.
            $table->string('specification_url')->nullable()->after('specs');

            $table->boolean('cod_available')->default(true)->after('specification_url');

            // none|returnable|replaceable|both
            $table->string('return_policy')->default('none')->after('cod_available');
            $table->unsignedInteger('return_window_days')->nullable()->after('return_policy');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'mrp',
                'features',
                'specification_url',
                'cod_available',
                'return_policy',
                'return_window_days',
            ]);
        });
    }
};
